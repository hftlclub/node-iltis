var mysql = require('../modules/mysql');

export class InventoryService {

    getCurrent(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
        + 'FROM ('
            + 'SELECT refProduct, refSizeType, Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS \'storage\', Sum(transactionChangeCounter) AS \'counter\' '
            + 'FROM transactions '
            + 'GROUP BY refProduct, refSizeType) as innerTable '
        + 'WHERE storage > 0 OR counter > 0;';
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

    getByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
        + 'FROM ('
            + 'SELECT refProduct, refSizeType, Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS \'storage\', Sum(transactionChangeCounter) AS \'counter\' '
            + 'FROM transactions '
            + 'WHERE refEvent <= ? '
            + 'GROUP BY refProduct, refSizeType) as innerTable '
        + 'WHERE storage > 0 OR counter > 0;';
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