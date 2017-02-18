var mysql = require('../modules/mysql');

export class EventService {

    getAll(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
            + 'FROM event_types '
            + 'INNER JOIN events ON(eventTypeId = refEventType) '
            + 'ORDER BY eventId DESC';
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
            + 'FROM event_types '
            + 'INNER JOIN events ON(eventTypeId = refEventType) '
            + 'WHERE eventId = ?;';
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
            + 'FROM ('
                + 'SELECT * '
                + 'FROM event_transfers '
                + 'INNER JOIN products ON (refProduct = productId)) AS transfersProducts '
            + 'INNER JOIN size_types ON (refSizeType = sizeTypeId) '
            + 'WHERE refEvent = ? AND transferChangeStorage != 0 '
            + 'ORDER BY transferId ASC';
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
        var query = 'SELECT * '
            + 'FROM ('
                + 'SELECT * '
                + 'FROM transactions '
                + 'INNER JOIN products ON (refProduct = productId)) AS transactionsProducts '
            + 'INNER JOIN size_types ON (refSizeType = sizeTypeId) '
            + 'WHERE refEvent = ? '
            + 'ORDER BY transactionId ASC';
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
