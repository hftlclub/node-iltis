var mysql = require('../modules/mysql');

export class EventService {

    static getAll(callback:(err:any, rows?:any)=>void) {
        var query = `SELECT *
                    FROM event_types
                    INNER JOIN events ON(eventTypeId = refEventType)
                    ORDER BY eventId DESC`;
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

    static getById(id: number, callback:(err:any, rows?:any)=>void) {
        var query = `SELECT *
                    FROM event_types
                    INNER JOIN events ON(eventTypeId = refEventType)
                    WHERE eventId = ?`;
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

    static getTransfersByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT *
                            FROM event_transfers
                            INNER JOIN products ON (refProduct = productId)) AS transfersProducts
                        INNER JOIN size_types ON (refSizeType = sizeTypeId)
                        WHERE refEvent = ? AND transferChangeStorage != 0
                        ORDER BY transferId ASC) AS transfers
                    INNER JOIN product_categories ON (refCategory = categoryId)
                    INNER JOIN product_units ON (refUnit = unitId)`;
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

    static getTransactionsByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT *
                            FROM transactions
                            INNER JOIN products ON (refProduct = productId)) AS transactionsProducts
                        INNER JOIN size_types ON (refSizeType = sizeTypeId)
                        WHERE refEvent = ?
                        ORDER BY transactionId ASC) AS transactions
                    INNER JOIN product_categories ON (refCategory = categoryId)
                    INNER JOIN product_units ON (refUnit = unitId)`;
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

    static getCalculation(id: number, callback:(err:any, rows?:any)=>void) {
        var query = `SELECT (eventCashAfter - eventCashBefore) AS sales, costs, ((eventCashAfter - eventCashBefore) - costs) AS profit
                    FROM (
                        SELECT refEvent, (SUM(transactionChangeTotal * deliveryCosts) * (-1)) AS costs
                        FROM (
                            SELECT refEvent, refProduct AS productId, refSizeType AS sizeTypeId, transactionChangeTotal
                            FROM transactions
                            WHERE refEvent = ?) AS transactions
                        INNER JOIN product_delivery_costs ON (refProduct = productId AND refSizeType = sizeTypeId)) AS costsTable
                    INNER JOIN events ON (refEvent = eventId)`;
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
}
