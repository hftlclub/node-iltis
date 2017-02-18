var mysql = require('../modules/mysql');

export class CrateTypeService {

    getAll(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
            + 'FROM size_types '
            + 'INNER JOIN crate_types ON(sizeTypeId = refSizeType) '
            + 'ORDER BY crateTypeDesc ASC';
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
        var query = 'SELECT * '
            + 'FROM size_types '
            + 'INNER JOIN crate_types ON(sizeTypeId = refSizeType) '
            + 'WHERE crateTypeId = ?;'
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

    getProductsCrates(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
            + 'FROM crate_types '
            + 'INNER JOIN product_crates ON (crateTypeId = refCrateType) '
            + 'ORDER BY crateTypeSlots DESC';
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

    getProductCratesByProductId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
            + 'FROM ('
                + 'SELECT * '
                + 'FROM size_types '
                + 'INNER JOIN crate_types ON(sizeTypeId = refSizeType)) AS sizeCrates '
            + 'INNER JOIN product_crates ON(crateTypeId = refCrateType) '
            + 'WHERE refProduct = ? '
            + 'ORDER BY crateTypeSlots DESC';
        mysql.conn.query(query, id, (err, rows, fields) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };
}
