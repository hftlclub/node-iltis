import { NotFoundError, BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ImageService } from '../services/image-service';
import { FileUploadService } from '../services/file-upload-service';
import { ContentType } from '../contenttype';
import { Product, ProductFactory } from '../shared/models/product';
import { ProductService } from '../services/product-service';
import { CrateTypeFactory } from '../shared/models/cratetype';
import { CrateTypeService } from '../services/cratetype-service';
import { SizeTypeService } from '../services/sizetype-service';
import { SizeFactory } from '../shared/models/size';

const config = require('../../config');

export class ProductController {

    // GET: Return all products
    getAll(req: Request, res: Response, next: Next) {
        ProductService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let products: Product[] = rows.map(row => ProductFactory.fromObj(row));
            CrateTypeService.getProductsCrates((err, rows) => {
                if (err) return next(new InternalError());
                rows.forEach(row => {
                    products.find(f => f.id === row.refProduct).crateTypes.push(CrateTypeFactory.fromObj(row));
                });
                SizeTypeService.getProductsSizes((err, rows) => {
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
            SizeTypeService.getProductSizesByProductId(product.id, (err, rows) => {
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

    // POST: Add new Size to Product
    addSizeToProduct(req: Request, res: Response, next: Next) {
        const productId = parseInt(req.params.productId, 0);
        ProductService.addSizeToProduct(SizeFactory.toDbObject(req.body, productId), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) res.send(201);
            else next(new InternalError());
        });
    };

    // POST: Add new CrateType to Product
    addCrateTypeToProduct(req: Request, res: Response, next: Next) {
        const productId = parseInt(req.params.productId, 0);
        const crateTypeId = CrateTypeFactory.fromObj(req.body).id;
        ProductService.addCrateTypeToProduct(productId, crateTypeId, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) res.send(201);
            else next(new InternalError());
        });
    };
}
