import { SizeFactory } from './../shared/models/size/size-factory';
import { ProductFactory } from './../shared/models/product/product-factory';

let mysql = require('../modules/mysql');

export class ProductService {

    static getAll(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM products
                        INNER JOIN product_categories ON (categoryId = refCategory)) AS productCategories
                    INNER JOIN product_units ON (unitId = refUnit)
                    ORDER BY categoryId ASC`;
        mysql.conn.query(query, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    }

    static getById(productId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM products
                        INNER JOIN product_categories ON (categoryId = refCategory)) AS productCategories
                    INNER JOIN product_units ON (unitId = refUnit)
                    WHERE productId = ?
                    ORDER BY categoryId ASC`;
        mysql.conn.query(query, productId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows[0]) {
                return callback(null, false);
            }
            return callback(null, rows[0]);
        });
    }

    static addProduct(product: any, callback: (err: any, result?: any) => void) {
        product.productActive = true;
        product.productDeleted = false;
        let query = `INSERT INTO products SET ?`;
        mysql.conn.query(query, product, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static updateProduct(product: any, callback: (err: any, result?: any) => void) {
        let query = `UPDATE products SET ?
                    WHERE productId = ?`;
        mysql.conn.query(query, [product, product.productId], (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static setProductImage(productId: number, imgFilename: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let query = `UPDATE products SET productImgFilename = ? WHERE productId = ?`;
            mysql.conn.query(query, [imgFilename, productId], (err, result) => {
                if (err) { reject(err); }
                resolve(result);
            });
        });
    }

    static addSizeToProduct(size: any, callback: (err: any, result?: any) => void) {
        size.sizeActive = true;
        let query = `INSERT INTO product_sizes SET ?`;
        mysql.conn.query(query, size, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static updateSizeOfProduct(size: any, callback: (err: any, result?: any) => void) {
        let query = `UPDATE product_sizes SET ?
                    WHERE refProduct = ? AND refSizeType = ?`;
        mysql.conn.query(query, [size, size.refProduct, size.refSizeType], (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static addCrateTypeToProduct(productId: number, crateTypeId: number, callback: (err: any, result?: any) => void) {
        let query = `INSERT INTO product_crates SET ?`;
        mysql.conn.query(query, { refProduct : productId, refCrateType : crateTypeId }, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };
}
