import { CategoryFactory } from './../shared/models/category/category-factory';
let mysql = require('../modules/mysql');

export class CategoryService {

    static getAll(productCount: boolean, callback: (err: any, rows?: any) => void) {
        let queryCountFalse = `SELECT *
                    FROM product_categories
                    WHERE categoryDeleted = false
                    ORDER BY categoryId ASC`;
        let queryCountTrue = `SELECT categoryId, categoryName, categoryDesc, categoryDeleted, COUNT(productRefCategory) productCount
                    FROM product_categories
                    LEFT JOIN products ON (categoryId = productRefCategory)
                    WHERE categoryDeleted = false
                    GROUP BY categoryId
                    ORDER BY categoryId ASC`;
        mysql.conn.query(productCount ? queryCountTrue : queryCountFalse, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };

    static getById(categoryId: number, callback: (err: any, row?: any) => void) {
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
            category.categoryId = result.insertId;
            result.payload = CategoryFactory.fromObj(category);
            return callback(null, result);
        });
    };

    static updateCategory(category: any, callback: (err: any, result?: any) => void) {
        delete category.categoryDeleted;
        let query = `UPDATE product_categories SET ?
                    WHERE categoryId = ?`;
        mysql.conn.query(query, [category, category.categoryId], (err, result) => {
            if (err) {
                return callback(err);
            }
            result.payload = CategoryFactory.fromObj(category);
            return callback(null, result);
        });
    };

    static deleteCategory(categoryId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM product_categories
                    WHERE categoryId = ?`;
        mysql.conn.query(query, categoryId, (err, result) => {
            if (err) {
                query = `UPDATE product_categories SET categoryDeleted = true
                WHERE categoryId = ?`;
                mysql.conn.query(query, categoryId, (err, result) => {
                    if (err) {
                        return callback(err);
                    }
                    result.note = 'SET categoryDeleted = true';
                    return callback(null, 'result');
                });
            } else {
                result.note = 'DELETED SQL ROW PERMANENTLY';
                return callback(null, result);
            }
        });
    };
}
