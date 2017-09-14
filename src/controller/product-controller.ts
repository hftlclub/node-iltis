import { EventService } from './../services/event-service';
import { InventoryService } from './../services/inventory-service';
import { LockedError, NotFoundError, BadRequestError, InternalError, Request, Response, Next, ForbiddenError } from 'restify';
import { ImageService } from '../services/image-service';
import { FileUploadService } from '../services/file-upload-service';
import { ContentType } from '../contenttype';
import { Product, ProductFactory } from '../shared/models/product';
import { ProductService } from '../services/product-service';
import { CrateType, CrateTypeFactory } from '../shared/models/cratetype';
import { CrateTypeService } from '../services/cratetype-service';
import { SizeTypeService } from '../services/sizetype-service';
import { SizeFactory } from '../shared/models/size';
import { Inventory, InventoryFactory } from '../shared/models/inventory';

const config = require('../../config');

export class ProductController {

    // GET: Return all products
    getAll(req: Request, res: Response, next: Next) {
        let showInactiveProducts: boolean = req.query.showInactiveProducts == 'true' ? true : false;
        ProductService.getAll(showInactiveProducts, (err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let products: Product[] = rows.map(row => ProductFactory.fromObj(row));
            CrateTypeService.getProductsCrates((err, rows) => {
                if (err) return next(new InternalError());
                rows.forEach(row => {
                    products.find(f => f.id === row.refProduct).crateTypes.push(CrateTypeFactory.fromObj(row));
                });
                let showInactiveSizes: boolean = req.query.showInactiveSizes == 'true' ? true : false;
                SizeTypeService.getProductsSizes(showInactiveSizes, (err, rows) => {
                    if (err) return next(new InternalError());
                    rows.forEach(row => {
                        products.find(f => f.id === row.refProduct).sizes.push(SizeFactory.fromObj(row));
                    });
                    res.send(products, ContentType.ApplicationJSON);
                });
            });
        });
    };

    // GET: Return single product
    getById(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        ProductService.getById(productId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid productId'));
            if (!row) next(new NotFoundError('Product does not exist'));
            let product: Product = ProductFactory.fromObj(row);
            let showInactiveSizes: boolean = req.query.showInactiveSizes == 'true' ? true : false;
            SizeTypeService.getProductSizesByProductId(product.id, showInactiveSizes, (err, rows) => {
                if (err) return next(new InternalError());
                if (rows.length) product.sizes = rows.map(row => SizeFactory.fromObj(row));
                CrateTypeService.getProductCratesByProductId(product.id, (err, rows) => {
                    if (err) return next(new InternalError());
                    if (!rows.length) {
                        res.send(product, ContentType.ApplicationJSON);
                    }
                    product.crateTypes = rows.map(row => CrateTypeFactory.fromObj(row));
                    res.send(product, ContentType.ApplicationJSON);
                });
            });
        });
    };

    // PUT: Upload image for product
    async uploadImage(req: Request | any, res: Response, next: Next) {
        const productId = parseInt(req.params.productId, 0);
        try {
            let rawFile = await FileUploadService.uploadMultipartFile(req, res);
            await ImageService.squareResizeExtend(rawFile.path, rawFile.path, config.imageResizeLength);

            let uploadedImage = await FileUploadService.uploadFileToCDN(rawFile.path, rawFile.name);
            await ProductService.setProductImage(productId, uploadedImage.fullUrl);

            res.send(204);
        } catch (e) {
            console.log(e);
            next(new InternalError(e));
        }
    }

    // POST: Add new Product
    addProduct(req: Request, res: Response, next: Next) {
        let product = ProductFactory.toDbObject(req.body);
        product.productImgFilename = config.productDefaultImage;
        ProductService.addProduct(product, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                ProductService.getById(result.insertId, (err, row) => {
                    if (err) return next(new InternalError());
                    res.send(201, ProductFactory.fromObj(row), ContentType.ApplicationJSON);
                });
            } else next(new InternalError());
        });
    };

    // PUT: Update Product
    updateProduct(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        let updatedProduct: any = ProductFactory.toDbObject(req.body);
        updatedProduct.productId = productId;
        delete updatedProduct.productImgFilename;
        delete updatedProduct.productDeleted;
        delete updatedProduct.productTS;
        if (updatedProduct.productActive) {
            ProductService.updateProduct(updatedProduct, (err, result) => {
                if (err || !result) return next(new BadRequestError());
                res.send(204);
            });
        } else {
            InventoryService.getCurrent((err, rows) => {
                if (err) return next(new InternalError());
                let inventory: Inventory[] = !rows.length ? [] : rows.map(row => InventoryFactory.fromObj(row));
                if (inventory.find(i => i.product.id == productId)) return next(new LockedError());
                else {
                    EventService.countCurrentTransfersByProductId(productId, (err, result) => {
                        if (err || !result) return next(new InternalError());
                        if (result.counter !== 0) return next(new LockedError());
                        res.send(200);
                        ProductService.updateProduct(updatedProduct, (err, result) => {
                            if (err || !result) return next(new BadRequestError());
                            res.send(204);
                        });
                    });
                }
            });
        }
    };

    // PUT: Remove Product
    deleteProduct(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(new InternalError());
            let inventory: Inventory[] = !rows.length ? [] : rows.map(row => InventoryFactory.fromObj(row));
            if (inventory.find(i => i.product.id == productId)) return next(new LockedError());
            else {
                EventService.countCurrentTransfersByProductId(productId, (err, result) => {
                    if (err || !result) return next(new InternalError());
                    if (result.counter !== 0) return next(new LockedError());
                    res.send(200);
                    ProductService.deleteProduct(productId, (err, result) => {
                        if (err || !result) return next(new NotFoundError());
                        res.send(204);
                    });
                });
            }
        });
    };

    // POST: Add new Size to Product
    addSizeToProduct(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        ProductService.addSizeToProduct(SizeFactory.toDbObject(req.body, productId), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) res.send(201);
            else next(new InternalError());
        });
    };

    // PUT: Update Size of Product
    updateSizeOfProduct(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        let updatedSize: any = SizeFactory.toDbObject(req.body, productId);
        updatedSize.refSizeType = sizeTypeId;
        ProductService.updateSizeOfProduct(updatedSize, (err, result) => {
            if (err || !result) return next(new BadRequestError());
            res.send(204);
        });
    };

    // GET: Check if Size of Product is deletable
    isProductSizeDeletable(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        ProductService.countOccurrenceOfProductSizes(productId, sizeTypeId, (err, result) => {
            if (err || !result) return next(new InternalError());
            if (result.counter !== 0) return next(new ForbiddenError());
            res.send(200);
        });
    };

    // GET: Check if Size of Product is deactivatable
    isProductSizeUnused(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(new InternalError());
            let inventory: Inventory[] = !rows.length ? [] : rows.map(row => InventoryFactory.fromObj(row));
            if (inventory.find(i => i.product.id == productId && i.sizeType.id == sizeTypeId)) return next(new ForbiddenError());
            else {
                EventService.countCurrentTransfersByProductAndSizeTypeId(productId, sizeTypeId, (err, result) => {
                    if (err || !result) return next(new InternalError());
                    if (result.counter !== 0) return next(new ForbiddenError());
                    res.send(200);
                });
            }
        });
        res.send(200);
    };

    // GET: Check if Product is deletable or deactivatable
    isProductUnused(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(new InternalError());
            let inventory: Inventory[] = !rows.length ? [] : rows.map(row => InventoryFactory.fromObj(row));
            if (inventory.find(i => i.product.id == productId)) return next(new ForbiddenError());
            else {
                EventService.countCurrentTransfersByProductId(productId, (err, result) => {
                    if (err || !result) return next(new InternalError());
                    if (result.counter !== 0) return next(new ForbiddenError());
                    res.send(200);
                });
            }
        });
    };

    // DELETE: Remove Size of Product
    deleteSizeOfProduct(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        ProductService.countOccurrenceOfProductSizes(productId, sizeTypeId, (err, result) => {
            if (err || !result) return next(new InternalError());
            if (result.counter !== 0) return next(new ForbiddenError());
            ProductService.deleteSizeOfProduct(productId, sizeTypeId, (err, result) => {
                if (err || !result) return next(new NotFoundError());
                res.send(204);
            });
        });
    };

    // GET: Return all possible CrateTypes for a certain product
    getPossibleCrateTypesForProduct(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        ProductService.getPossibleCrateTypesForProduct(productId, (err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let crateTypes: CrateType[] = rows.map(row => CrateTypeFactory.fromObj(row));
            res.send(crateTypes, ContentType.ApplicationJSON);
        });
    };

    // POST: Add new CrateType to Product
    addCrateTypeToProduct(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        let crateTypeId = CrateTypeFactory.fromObj(req.body).id;
        ProductService.addCrateTypeToProduct(productId, crateTypeId, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) res.send(201);
            else next(new InternalError());
        });
    };

    // DELETE: Remove CrateType of Product
    deleteCrateTypeOfProduct(req: Request, res: Response, next: Next) {
        let productId = parseInt(req.params.productId, 0);
        let crateTypeId = parseInt(req.params.crateTypeId, 0);
        ProductService.deleteCrateTypeOfProduct(productId, crateTypeId, (err, result) => {
            if (err || !result) return next(new NotFoundError());
            res.send(204);
        });
    };
}
