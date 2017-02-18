var mysql = require('../modules/mysql');

export class SizeTypeService {

    getAll(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM size_types;';
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
        var query = 'SELECT * FROM size_types WHERE sizeTypeId = ?;';
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

    joinProductByProductId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
        + 'FROM ('
            + 'SELECT * '
            + 'FROM size_types '
        + 'INNER JOIN product_sizes ON (sizeTypeId = refSizeType)) AS innerTable '
        + 'WHERE refProduct = ?;';
        mysql.conn.query(query, id, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };

    joinProductSizes(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
        + 'FROM size_types '
        + 'INNER JOIN product_sizes ON (sizeTypeId = refSizeType);';
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

    joinCrateTypes(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
        + 'FROM size_types '
        + 'INNER JOIN crate_types ON(sizeTypeId = refSizeType) '
        + 'GROUP BY sizeTypeId;';
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
