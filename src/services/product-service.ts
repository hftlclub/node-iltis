import * as _ from 'lodash';
import { Product } from '../models/product';
import { ProductFactory } from '../models/product-factory';
import { SomeProducts } from '../some-products';
var mysql = require('../modules/mysql');


export class ProductService {

  private products: Product[];

  constructor() {
    this.products = SomeProducts.get();
  }


  getAll(callback:(err:any, rows?:any)=>void) {
    var query = 'SELECT * FROM products;';
    mysql.conn.query(query, (err, rows, fields) => {
      if (err) {
        return callback(err);
      }
      if (!rows.length) {
        return callback(null, false);
      }
      return callback(null, rows);
    });
  };
  
  getById(id: number) {
    return this.products.find(product => product.id === id)
  };

  idExists(id: number) {
    return !!this.getById(id);
  }

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
