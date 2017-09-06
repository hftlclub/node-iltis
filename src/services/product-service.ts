import { SizeFactory } from './../shared/models/size/size-factory';
import { ProductFactory } from './../shared/models/product/product-factory';

let mysql = require('../modules/mysql');

export class ProductService {

    static getAll(showInactive: boolean, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM products
                        INNER JOIN product_categories ON (categoryId = refCategory)) AS productCategories
                    INNER JOIN product_units ON (unitId = refUnit)
                    WHERE productDeleted = false
                    ORDER BY categoryId ASC`;
        if (!showInactive) query = query.replace('WHERE productDeleted = false',
            'WHERE productDeleted = false AND productActive = true');
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

    static deleteProduct(productId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM products
                    WHERE productId = ?`;
        mysql.conn.query(query, productId, (err, result) => {
            if (err) {
                query = `UPDATE products SET productDeleted = true
                WHERE productId = ?`;
                mysql.conn.query(query, productId, (err, result) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, result);
                });
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
            if (!size.sizeActive) {
                query = `DELETE FROM product_crates
                WHERE (product_crates.refProduct, product_crates.refCrateType) IN (
                    SELECT x.refProduct, x.refCrateType
                    FROM (SELECT * FROM product_crates) AS x
                    INNER JOIN crate_types ON (refCrateType = crateTypeId)
                    INNER JOIN size_types ON (refSizeType = sizeTypeId)
                    WHERE refProduct = ? AND sizeTypeId = ?
                )`;
                mysql.conn.query(query, [size.refProduct, size.refSizeType], (err, result) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, result);
                });
            }
            return callback(null, result);
        });
    };

    static countOccurrenceOfProductSizes(productId: number, sizeTypeId: number, callback: (err: any, result?: any) => void) {
        let query = `SELECT COUNT(*) AS counter
                    FROM (
                        SELECT *
                        FROM transactions
                        UNION ALL
                        SELECT *
                        FROM event_transfers
                    ) AS combinedTables
                    WHERE refProduct = ? AND refSizeType = ?`;
        mysql.conn.query(query, [productId, sizeTypeId], (err, row) => {
            if (err) {
                return callback(err);
            }
            return callback(null, row[0]);
        });
    };

    static deleteSizeOfProduct(productId: number, sizeTypeId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM product_sizes
                    WHERE refProduct = ? AND refSizeType = ?`;
        mysql.conn.query(query, [productId, sizeTypeId], (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static getPossibleCrateTypesForProduct(productId: number, callback: (err: any, result?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT refProduct, crateTypeId, crate_types.refSizeType, crateTypeDesc, crateTypeSlots
                        FROM product_sizes
                        INNER JOIN crate_types ON (product_sizes.refSizeType = crate_types.refSizeType)
                        WHERE refProduct = ?) AS possibleCrateTypes
                    INNER JOIN size_types ON (sizeTypeId = refSizeType)
                    WHERE (refProduct, crateTypeId) NOT IN (
                        SELECT *
                        FROM product_crates)`;
        mysql.conn.query(query, productId, (err, result) => {
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

    static deleteCrateTypeOfProduct(productId: number, crateTypeId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM product_crates
                    WHERE refProduct = ? AND refCrateType = ?`;
        mysql.conn.query(query, [productId, crateTypeId], (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };
}
