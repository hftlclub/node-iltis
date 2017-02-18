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
        var query = 'SELECT * '
        + 'FROM event_transfers '
        + 'WHERE refEvent = ? AND transferChangeStorage != 0;';
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
        var query = 'SELECT * '
        + 'FROM ('
            + 'SELECT * '
            + 'FROM products '
            + 'INNER JOIN event_transfers ON(refProduct = productId)) AS innerTable '
            + 'WHERE refEvent = ?;';
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
        var query = 'SELECT * '
        + 'FROM ('
            + 'SELECT * '
            + 'FROM size_types '
            + 'INNER JOIN event_transfers ON(refSizeType = sizeTypeId)) AS innerTable '
            + 'WHERE refEvent = ?;';
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
        var query = 'SELECT * '
        + 'FROM ('
            + 'SELECT * '
            + 'FROM products p '
            + 'INNER JOIN transactions ON(refProduct = productId)) AS innerTable '
            + 'WHERE refEvent = ?;';
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
        var query = 'SELECT * '
        + 'FROM ('
            + 'SELECT * '
            + 'FROM size_types '
            + 'INNER JOIN transactions  ON(refSizeType = sizeTypeId)) AS innerTable '
        + 'WHERE refEvent = ?;';
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
