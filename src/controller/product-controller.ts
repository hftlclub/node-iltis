import { NotFoundError, BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { Product, ProductFactory } from '../shared/models/product';
import { ProductService } from '../services/product-service';
import { CrateTypeFactory } from '../shared/models/cratetype';
import { CrateTypeService } from '../services/cratetype-service';
import { SizeTypeService } from '../services/sizetype-service';
import { SizeFactory } from '../shared/models/size';


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
                product.sizes = rows.map(row => SizeFactory.fromObj(row));
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
}
