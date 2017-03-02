import { Event } from '../shared/models/event';
let mysql = require('../modules/mysql');

export class EventService {

    static addEvent(event: any, callback: (err: any, result?: any) => void) {
        event.eventActive = true;
        event.eventCountedCounter = false;
        event.eventCountedStorage = false;
        let query = `INSERT INTO events SET ?`;
        mysql.conn.query(query, event, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static updateEvent(event: any, callback: (err: any, result?: any) => void) {
        let query = `UPDATE events SET ?
                    WHERE eventId = ?`;
        mysql.conn.query(query, [event, event.eventId], (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static deleteEvent(eventId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM events
                    WHERE eventId = ?`;
        mysql.conn.query(query, eventId, (err, result) => {
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

    static deleteTransfersByEventId(eventId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM event_transfers
                    WHERE refEvent = ?`;
        mysql.conn.query(query, eventId, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static addTransactions(transactions: any[], callback: (err: any, result?: any) => void) {
        let query = `INSERT INTO transactions
                    (refEvent, refProduct, refSizeType, transactionChangeCounter, transactionChangeTotal)
                    VALUES ` + transactions.map(t => `(${t.refEvent}, ${t.refProduct}, ${t.refSizeType}, ${t.transferChangeCounter}, ${t.transferChangeTotal})`).join(',');
        mysql.conn.query(query, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static deleteStorageTransfers(eventId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM event_transfers
                    WHERE refEvent = ? AND transferChangeCounter = 0`;
        mysql.conn.query(query, eventId, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static deleteCounterTransfers(eventId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM event_transfers
                    WHERE refEvent = ? AND transferChangeStorage = 0`;
        mysql.conn.query(query, eventId, (err, result) => {
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
                    ORDER BY eventDT DESC`;
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

    static countOpenEventsWithCountAllowed(callback: (err: any, rows?: any) => void) {
        let query = `SELECT COUNT(*) AS count
                    FROM event_types
                    INNER JOIN events ON(eventTypeId = refEventType)
                    WHERE eventTypeCountAllowed = true AND eventActive = true`;
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

    static getById(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM event_types
                    INNER JOIN events ON(eventTypeId = refEventType)
                    WHERE eventId = ?`;
        mysql.conn.query(query, eventId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows[0]) {
                return callback(null, false);
            }
            return callback(null, rows[0]);
        });
    };

    static convertTransfersToTransactions(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT refEvent, refProduct, refSizeType,
                            SUM(transferChangeCounter) AS transferChangeCounter,
                            (SUM(transferChangeStorage) + SUM(transferChangeCounter)) AS transferChangeTotal
                    FROM event_transfers
                    WHERE refEvent = ?
                    GROUP BY refProduct, refSizeType`;
        mysql.conn.query(query, eventId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    }

    static convertTransfersWithCountToTransactions(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT refEvent, refProduct, refSizeType, transferChangeCounter, (transferChangeTotal - tct) AS transferChangeTotal
                    FROM (
                        SELECT refProduct AS rP, refSizeType AS rSZ,
                            SUM(transferChangeCounter) AS tcc,
                            (SUM(transferChangeStorage) + SUM(transferChangeCounter)) AS tct
                        FROM (
                            SELECT MAX(transferTS) as maxTS
                            FROM event_transfers
                            WHERE refEvent = ?) as timeOfLastTransfer
                        INNER JOIN event_transfers
                        WHERE refEvent != ? AND transferTS < maxTS
                        GROUP BY refProduct, refSizeType) parallelTransfers
                    INNER JOIN (
                        SELECT refEvent, refProduct, refSizeType,
                                SUM(transferChangeCounter) AS transferChangeCounter,
                                (SUM(transferChangeStorage) + SUM(transferChangeCounter)) AS transferChangeTotal
                        FROM event_transfers
                        WHERE refEvent = ?
                        GROUP BY refProduct, refSizeType) eventTransfers
                    ON (refProduct = rP AND refSizeType = rSZ)`;
        mysql.conn.query(query, [eventId, eventId, eventId], (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    }

    static getLastTransfers(eventId: number, insertId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT *
                            FROM event_transfers
                            INNER JOIN products ON (refProduct = productId)) AS transfersProducts
                        INNER JOIN size_types ON (refSizeType = sizeTypeId)
                        WHERE refEvent = ? AND transferId >= ?
                        ORDER BY transferId ASC) AS transfers
                    INNER JOIN product_categories ON (refCategory = categoryId)
                    INNER JOIN product_units ON (refUnit = unitId)`;
        mysql.conn.query(query, [eventId, insertId], (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };

    static getTransfersByEventId(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT transferId, refEvent, refProduct, refSizeType,
                            (transferChangeStorage + transferChangeCounter) AS 'change'
                        FROM event_transfers
                        WHERE refEvent = ?) AS changes 
                    INNER JOIN products ON (refProduct = productId)
                    INNER JOIN size_types ON (refSizeType = sizeTypeId)
                    INNER JOIN product_categories ON (refCategory = categoryId)
                    INNER JOIN product_units ON (refUnit = unitId)
                    ORDER BY transferId ASC`;
        mysql.conn.query(query, eventId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };

    static getTransactionsByEventId(eventId: number, callback: (err: any, rows?: any) => void) {
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
        mysql.conn.query(query, eventId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };

    static getCalculation(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT (eventCashAfter - eventCashBefore) AS sales, costs, ((eventCashAfter - eventCashBefore) - costs) AS profit
                    FROM (
                        SELECT refEvent, (SUM(transactionChangeTotal * additionDeliveryCosts) * (-1)) AS costs
                        FROM (
                            SELECT refEvent, refProduct AS productId, refSizeType AS sizeTypeId, transactionChangeTotal
                            FROM transactions
                            WHERE refEvent = ?) AS transactions
                        INNER JOIN product_additions ON (refProduct = productId AND refSizeType = sizeTypeId)) AS costsTable
                    INNER JOIN events ON (refEvent = eventId)`;
        mysql.conn.query(query, eventId, (err, rows, fields) => {
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
