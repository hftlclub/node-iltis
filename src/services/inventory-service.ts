var mysql = require('../modules/mysql');

export class InventoryService {

    getCurrent(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM (SELECT refProduct, refSize, Sum(changeTotal)-Sum(changeCounter) AS \'storage\', Sum(changeCounter) AS \'counter\' FROM transactions GROUP BY refProduct, refSize) as innerTable WHERE storage > 0 OR counter > 0;';
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
        var query = 'SELECT * FROM (SELECT refProduct, refSize, Sum(changeTotal)-Sum(changeCounter) AS \'storage\', Sum(changeCounter) AS \'counter\' FROM transactions WHERE refEvent <= ? GROUP BY refProduct, refSize) as innerTable WHERE storage > 0 OR counter > 0;';
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