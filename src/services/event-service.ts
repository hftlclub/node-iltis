var mysql = require('../modules/mysql');

export class EventService {

    getAll(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM events;';
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
        var query = 'SELECT * FROM events WHERE eventId = ?;';
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

    getTransfersByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM event_transfers WHERE refEvent = ? AND changeStorage != 0;';
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

    joinProductTransfersByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM (SELECT et.refEvent, p.productId, p.refCategory, p.refUnit, p.name, p.description, p.priceIntern, p.imgFilename, p.active, p.deleted, p.timestamp FROM products p INNER JOIN event_transfers et ON(refProduct = productId)) AS innerTable WHERE refEvent = ?;';
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

    joinSizeTypeTransfersByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM (SELECT et.refEvent, st.sizeTypeId, st.amount, st.description, st.deleted FROM size_types st INNER JOIN event_transfers et ON(refSize = sizeTypeId)) AS innerTable WHERE refEvent = ?;';
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

    getTransactionsByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM transactions WHERE refEvent = ?;';
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

    joinProductTransactionsByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM (SELECT t.refEvent, p.productId, p.refCategory, p.refUnit, p.name, p.description, p.priceIntern, p.imgFilename, p.active, p.deleted, p.timestamp FROM products p INNER JOIN transactions t ON(refProduct = productId)) AS innerTable WHERE refEvent = ?;';
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

    joinSizeTypeTransactionsByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM (SELECT t.refEvent, st.sizeTypeId, st.amount, st.description, st.deleted FROM size_types st INNER JOIN transactions t ON(refSize = sizeTypeId)) AS innerTable WHERE refEvent = ?;';
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
