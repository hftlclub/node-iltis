import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Product } from '../models/product';
import { ProductFactory } from '../models/product-factory';
import { ProductService } from '../services/product-service';

export class ProductController {

  constructor(private productService: ProductService) { }

  getAll(req, res, next) {
    let products : Product[] = [];
    this.productService.getAll((err, rows)=>{
      if (err) return next(err);
      if (!rows.length) {
        // Todo: Implementet correct feedback (error 204)
        res.send(products, { 'Content-Type': 'application/json; charset=utf-8' });
      }
      else {       
        for (var productObj of rows)
          products.push(ProductFactory.fromJson(productObj));
        res.send(products, { 'Content-Type': 'application/json; charset=utf-8' });
      }
    });
  };

  getById(req, res, next) {

    let id = parseInt(req.params.productId);
    let product = this.productService.getById(id);

    if (!product) {
      return next(new NotFoundError('Product does not exist'));
    }

    res.send(product, { 'Content-Type': 'application/json; charset=utf-8' });
    next();
  };

  create(req, res, next) {

    let productJson = req.body;
    let id = productJson.id;

    if (!id) {
      return next(new BadRequestError('Invalid data: Id number is mandatory'));
    }

    if (this.productService.idExists(id)) {
      return next(new ConflictError('Product does already exist'));
    }

    let product = ProductFactory.fromJson(productJson);
    this.productService.create(product)

    res.send(201); // 201 Created
    next();
  };

  update(req, res, next) {

    let productJson = req.body;
    let id = productJson.id;

    if (!id) {
      return next(new BadRequestError('Invalid data: Id number is mandatory'));
    }

    if (parseInt(req.params.productId) != id) {
      return next(new BadRequestError('Invalid data: Id from query and body must match'));
    }

    if (!this.productService.idExists(id)) {
      return next(new NotFoundError('Product does not exist'));
    }

    let product = ProductFactory.fromJson(productJson);
    this.productService.update(product)

    res.send(200);
    next();
  };

  delete(req, res, next) {

    let id = parseInt(req.params.productId);
    this.productService.delete(id);

    res.send(200);
    next();
  };

  reset(req, res, next) {

    this.productService.reset();

    if (res && next) {
      res.send(200);
      next();
    }
  };
}
