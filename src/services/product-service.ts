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
    };

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
    };
}
