import { Event } from '../shared/models/event';
let mysql = require('../modules/mysql');

export class EventService {

    static addEvent(event: any, callback: (err: any, result?: any) => void) {
        event.eventActive = true;
        let query = `INSERT INTO events SET ?`;
        mysql.conn.query(query, event, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static addTransfers(transfers: any[], callback: (err: any, result?: any) => void) {
        let query = `INSERT INTO event_transfers
                    (refEvent, refProduct, refSizeType, transferChangeStorage, transferChangeCounter)
                    VALUES ` + transfers.map(t => `(${t.refEvent}, ${t.refProduct}, ${t.refSizeType}, ${t.transferChangeStorage}, ${t.transferChangeCounter})`).join(',');
        mysql.conn.query(query, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static getAll(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
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

    static getById(id: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
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

    static getTransfersByEventId(id: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT *
                            FROM event_transfers
                            INNER JOIN products ON (refProduct = productId)) AS transfersProducts
                        INNER JOIN size_types ON (refSizeType = sizeTypeId)
                        WHERE refEvent = ?
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

    static getStorageTransfersByEventId(id: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
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

    static getCounterTransfersByEventId(id: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT *
                            FROM event_transfers
                            INNER JOIN products ON (refProduct = productId)) AS transfersProducts
                        INNER JOIN size_types ON (refSizeType = sizeTypeId)
                        WHERE refEvent = ? AND transferChangeCounter != 0
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

    static getTransactionsByEventId(id: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
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

    static getCalculation(id: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT (eventCashAfter - eventCashBefore) AS sales, costs, ((eventCashAfter - eventCashBefore) - costs) AS profit
                    FROM (
                        SELECT refEvent, (SUM(transactionChangeTotal * additionDeliveryCosts) * (-1)) AS costs
                        FROM (
                            SELECT refEvent, refProduct AS productId, refSizeType AS sizeTypeId, transactionChangeTotal
                            FROM transactions
                            WHERE refEvent = ?) AS transactions
                        INNER JOIN product_additions ON (refProduct = productId AND refSizeType = sizeTypeId)) AS costsTable
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
