//import { DefaultSqlService } from './default-sql-service';
var mysql = require('../modules/mysql');

export class CategoryService {

    getAll(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM product_categories;';
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

    getById(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM product_categories WHERE categoryId = ?;';
        mysql.conn.query(query, id, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows[0]) {
                return callback(null, false);
            }
            return callback(null, rows[0]);
        });
    };

    joinProducts(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT pc.categoryId, pc.name, pc.description, pc.deleted FROM product_categories pc INNER JOIN products ON(categoryId = refCategory) GROUP BY categoryId;';
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
}
