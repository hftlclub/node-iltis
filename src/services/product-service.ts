import * as _ from 'lodash';

import { Product } from '../models/product';
import { ProductFactory } from '../models/product-factory';
import { SomeProducts } from '../some-products';

export class ProductService {

  private products: Product[];

  constructor() {
    this.products = SomeProducts.get();
  }

  getAll(): Product[] {
    return _(this.products)
      .sortBy(b => b.id)
      .value();
  };

  getById(id: number) {
    return this.products.find(product => product.id === id)
  };

  create(product: Product) {
    this.products.push(product);
  };

  update(product: Product) {
    this.delete(product.id);
    this.create(product);
  };

  delete(id: number) {
    return this.products = this.products.filter(product => product.id !== id);
  };

  reset() {
    this.products = SomeProducts.get();
  };
}
