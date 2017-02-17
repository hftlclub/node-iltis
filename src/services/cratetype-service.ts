var mysql = require('../modules/mysql');

export class CrateTypeService {

    getAll(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM crate_types;';
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
        var query = 'SELECT * FROM crate_types WHERE crateTypeId = ?;';
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

    joinProductCrates(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT pc.refProduct, ct.crateTypeId, ct.refSize, ct.slots FROM crate_types ct INNER JOIN product_crates pc ON (crateTypeId = refCrateType);';
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

    joinProductCratesByProductId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT ct.crateTypeId, ct.refSize, ct.slots FROM crate_types ct INNER JOIN product_crates pc ON (crateTypeId = refCrateType) WHERE pc.refProduct = ? GROUP BY crateTypeId;';
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
}
