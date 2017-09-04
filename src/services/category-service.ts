import { CategoryFactory } from './../shared/models/category/category-factory';
let mysql = require('../modules/mysql');

export class CategoryService {

    static getAll(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM product_categories
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

    static getById(categoryId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM product_categories
                    WHERE categoryId = ?`;
        mysql.conn.query(query, categoryId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows[0]) {
                return callback(null, false);
            }
            return callback(null, rows[0]);
        });
    };

    static addCategory(category: any, callback: (err: any, result?: any) => void) {
        category.categoryDeleted = false;
        let query = `INSERT INTO product_categories SET ?`;
        mysql.conn.query(query, category, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };
}
