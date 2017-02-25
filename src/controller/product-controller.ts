import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { ContentType } from '../contenttype';
import { Product, ProductFactory } from '../shared/models/product';
import { ProductService } from '../services/product-service';
import { CrateTypeFactory } from '../shared/models/cratetype';
import { CrateTypeService } from '../services/cratetype-service';
import { SizeTypeFactory } from '../shared/models/sizetype';
import { SizeTypeService } from '../services/sizetype-service';
import { DeliveryCostsFactory } from '../shared/models/deliverycosts';
import { MinimumStockFactory } from '../shared/models/minimumstock';


export class ProductController {

    getAll(req, res, next) {
        let products: Product[] = [];
        ProductService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(products, ContentType.ApplicationJSON);
            }
            products = rows.map(row => ProductFactory.fromObj(row));
            CrateTypeService.getProductsCrates((err, rows) => {
                if (err) return next(err);
                rows.forEach(row => {
                    products.find(f => f.id === row.refProduct).crateTypes.push(CrateTypeFactory.fromObj(row));
                });
                SizeTypeService.getProductsSizes((err, rows) => {
                    if (err) return next(err);
                    rows.forEach(row => {
                        products.find(f => f.id === row.refProduct).sizeTypes.push(SizeTypeFactory.fromObj(row));
                    });
                    ProductService.getProductsAdditions((err, rows) => {
                        if (err) return next(err);
                        rows.forEach(row => {
                            products.find(f => f.id === row.refProduct).deliveryCosts.push(DeliveryCostsFactory.fromObj(row));
                            products.find(f => f.id === row.refProduct).minimumStocks.push(MinimumStockFactory.fromObj(row));
                        });
                        res.send(products, ContentType.ApplicationJSON);
                    });
                });
            });
        });
    };

    getById(req, res, next) {
        let productId = parseInt(req.params.productId, 0);
        let product: Product = ProductFactory.empty();
        ProductService.getById(productId, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                next(new NotFoundError('Product does not exist'));
            }
            product = ProductFactory.fromObj(row);
            SizeTypeService.getProductSizesByProductId(product.id, (err, rows) => {
                if (err) return next(err);
                product.sizeTypes = rows.map(row => SizeTypeFactory.fromObj(row));
                ProductService.getProductAdditionsByProductId(product.id, (err, rows) => {
                    if (err) return next(err);
                    product.deliveryCosts = rows.map(row => DeliveryCostsFactory.fromObj(row));
                    product.minimumStocks = rows.map(row => MinimumStockFactory.fromObj(row));
                    CrateTypeService.getProductCratesByProductId(product.id, (err, rows) => {
                        if (err) return next(err);
                        if (!rows.length) {
                            res.send(product, ContentType.ApplicationJSON);
                        }
                        product.crateTypes = rows.map(row => CrateTypeFactory.fromObj(row));
                        res.send(product, ContentType.ApplicationJSON);
                    });
                });
            });
        });
    };
}
