import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Product } from '../shared/models/product/product';
import { ProductFactory } from '../shared/models/product/product-factory';
import { ProductService } from '../services/product-service';
import { CrateTypeFactory } from '../shared/models/cratetype/cratetype-factory';
import { CrateTypeService } from '../services/cratetype-service';
import { SizeTypeFactory } from '../shared/models/sizetype/sizetype-factory';
import { SizeTypeService } from '../services/sizetype-service';
import { DeliveryCostsFactory } from '../shared/models/deliverycosts/deliverycosts-factory';


export class ProductController {

    getAll(req, res, next) {
        let products: Product[] = [];
        ProductService.getAll((err, rows)=>{
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(products, { 'Content-Type': 'application/json; charset=utf-8' });
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
                    ProductService.getProductsPrices((err, rows) => {
                        if (err) return next(err);
                        rows.forEach(row => {
                            products.find(f => f.id === row.refProduct).deliveryCosts.push(DeliveryCostsFactory.fromObj(row));
                        });
                        res.send(products, { 'Content-Type': 'application/json; charset=utf-8' });
                    });
                });
            });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.productId);
        let product: Product = ProductFactory.empty();
        ProductService.getById(id, (err, row)=>{
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('Product does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            product = ProductFactory.fromObj(row);
            SizeTypeService.getProductSizesByProductId(product.id, (err, rows) => {
                if (err) return next(err);
                product.sizeTypes = rows.map(row => SizeTypeFactory.fromObj(row));
                ProductService.getProductPricesByProductId(product.id, (err, rows) => {
                    if (err) return next(err);
                    product.deliveryCosts = rows.map(row => DeliveryCostsFactory.fromObj(row));
                    CrateTypeService.getProductCratesByProductId(product.id, (err, rows) => {
                        if (err) return next(err);
                        if (!rows.length) {
                            res.send(product, { 'Content-Type': 'application/json; charset=utf-8' });
                        }
                        product.crateTypes = rows.map(row => CrateTypeFactory.fromObj(row));
                        res.send(product, { 'Content-Type': 'application/json; charset=utf-8' });
                    });
                });
            });
        });
    };
}
