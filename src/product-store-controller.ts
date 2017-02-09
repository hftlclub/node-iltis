import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { Product } from './shared/product';
import { ProductFactory } from './shared/product-factory';
import { ProductStore } from './product-store';

export class ProductStoreController {

  constructor(private store: ProductStore) { }

  getAll(req, res, next) {
    res.send(this.store.getAll(), { 'Content-Type': 'application/json; charset=utf-8' });
    next();
  };

  getById(req, res, next) {

    let id = parseInt(req.params.productId);
    let product = this.store.getById(id);

    if (!product) {
      return next(new NotFoundError('Product does not exist'));
    }

    res.send(product, { 'Content-Type': 'application/json; charset=utf-8' });
    next();
  };

  checkId(req, res, next) {

    let id = parseInt(req.params.productId);
    let productExist = this.store.idExists(id);

    res.send(productExist, { 'Content-Type': 'application/json; charset=utf-8' });
    next();
  };

  create(req, res, next) {

    let productJson = req.body;
    let id = productJson.id;

    if (!id) {
      return next(new BadRequestError('Invalid data: Id number is mandatory'));
    }

    if (this.store.idExists(id)) {
      return next(new ConflictError('Product does already exist'));
    }

    let product = ProductFactory.fromJson(productJson);
    this.store.create(product)

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

    if (!this.store.idExists(id)) {
      return next(new NotFoundError('Product does not exist'));
    }

    let product = ProductFactory.fromJson(productJson);
    this.store.update(product)

    res.send(200);
    next();
  };

  delete(req, res, next) {

    let id = parseInt(req.params.productId);
    this.store.delete(id);

    res.send(200);
    next();
  };

  reset(req, res, next) {

    this.store.reset();

    if (res && next) {
      res.send(200);
      next();
    }
  };
}
