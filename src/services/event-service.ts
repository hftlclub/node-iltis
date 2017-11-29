import { Event, EventFactory} from '../shared/models/event';
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
        let query = `UPDATE events new SET ?
                    WHERE eventId = ?`;
        mysql.conn.query(query, [event, event.eventId], (err, result) => {
            if (err) {
                console.log(err);
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
                    (transferRefEvent, transferRefProduct, transferRefSizeType, transferChangeStorage, transferChangeCounter)
                    VALUES ` + transfers.map(t => `(${t.transferRefEvent}, ${t.transferRefProduct}, ${t.transferRefSizeType}, ${t.transferChangeStorage}, ${t.transferChangeCounter})`).join(',');
        mysql.conn.query(query, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static deleteTransfersByEventId(eventId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM event_transfers
                    WHERE transferRefEvent = ?`;
        mysql.conn.query(query, eventId, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static addTransactions(transactions: any[], callback: (err: any, result?: any) => void) {
        let query = `INSERT INTO event_transactions
                    (transactionRefEvent, transactionRefProduct, transactionRefSizeType, transactionChangeCounter, transactionChangeTotal)
                    VALUES ` + transactions.map(t => `(${t.transactionRefEvent}, ${t.transactionRefProduct}, ${t.transactionRefSizeType}, ${t.transferChangeCounter}, ${t.transferChangeTotal})`).join(',');
        mysql.conn.query(query, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static deleteStorageTransfers(eventId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM event_transfers
                    WHERE transferRefEvent = ? AND transferChangeCounter = 0`;
        mysql.conn.query(query, eventId, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static deleteCounterTransfers(eventId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM event_transfers
                    WHERE transferRefEvent = ? AND transferChangeStorage = 0`;
        mysql.conn.query(query, eventId, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static getAll(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM event_types
                        INNER JOIN events ON(eventTypeId = eventRefEventType)) AS event
                    LEFT JOIN (SELECT *
                    FROM event_notes en1, (SELECT eventNoteRefEvent AS 'dummy', COUNT(*) AS 'noteCount'
                        FROM event_notes
                        GROUP BY eventNoteRefEvent) en3
                    WHERE eventNoteTS = (SELECT MAX(eventNoteTS) FROM event_notes en2 WHERE en1.eventNoteRefEvent = en2.eventNoteRefEvent) AND dummy = eventNoteRefEvent) AS note ON (eventId = eventNoteRefEvent)`;
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
                    INNER JOIN events ON(eventTypeId = eventRefEventType)
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

    static getById(eventId: number, callback: (err: any, row?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM event_types
                        INNER JOIN events ON(eventTypeId = eventRefEventType)
                        WHERE eventId = ? ) AS event
                    LEFT JOIN (SELECT *
                    FROM event_notes en1, (SELECT COUNT(*) AS 'noteCount'
                        FROM event_notes
                        WHERE eventNoteRefEvent = ?
                        GROUP BY eventNoteRefEvent) en3
                    WHERE eventNoteTS = (SELECT MAX(eventNoteTS) FROM event_notes en2 WHERE en1.eventNoteRefEvent = en2.eventNoteRefEvent) AND eventNoteRefEvent = ?) AS note ON (eventId = eventNoteRefEvent)`;
        mysql.conn.query(query, [eventId, eventId, eventId], (err, rows, fields) => {
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
        let query = `SELECT transferRefEvent AS transactionRefEvent, transferRefProduct AS transactionRefProduct, transferRefSizeType AS transactionRefSizeType,
                            SUM(transferChangeCounter) AS transferChangeCounter,
                            (SUM(transferChangeStorage) + SUM(transferChangeCounter)) AS transferChangeTotal
                    FROM event_transfers
                    WHERE transferRefEvent = ?
                    GROUP BY transferRefProduct, transferRefSizeType`;
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
        let query = `SELECT transferRefEvent, transferRefProduct, transferRefSizeType, transferChangeCounter, (transferChangeTotal - tct) AS transferChangeTotal
                    FROM (
                        SELECT transferRefProduct AS rP, transferRefSizeType AS rSZ,
                            SUM(transferChangeCounter) AS tcc,
                            (SUM(transferChangeStorage) + SUM(transferChangeCounter)) AS tct
                        FROM (
                            SELECT MAX(transferTS) as maxTS
                            FROM event_transfers
                            WHERE transferRefEvent = ?) as timeOfLastTransfer
                        INNER JOIN event_transfers
                        WHERE transferRefEvent != ? AND transferTS < maxTS
                        GROUP BY transferRefProduct, transferRefSizeType) parallelTransfers
                    INNER JOIN (
                        SELECT transferRefEvent, transferRefProduct, transferRefSizeType,
                                SUM(transferChangeCounter) AS transferChangeCounter,
                                (SUM(transferChangeStorage) + SUM(transferChangeCounter)) AS transferChangeTotal
                        FROM event_transfers
                        WHERE transferRefEvent = ?
                        GROUP BY transferRefProduct, transferRefSizeType) eventTransfers
                    ON (transferRefProduct = rP AND transferRefSizeType = rSZ)`;
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
                        FROM event_transfers
                        WHERE transferRefEvent = ? AND transferId >= ?) AS transfers
                    INNER JOIN products ON (transferRefProduct = productId)
                    INNER JOIN size_types ON (transferRefSizeType = sizeTypeId)
                    INNER JOIN product_categories ON (productRefCategory = categoryId)
                    INNER JOIN product_units ON (sizeTypeRefUnit = unitId)
                    ORDER BY transferId ASC`;
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
                        SELECT transferId, transferRefEvent, transferRefProduct, transferRefSizeType,
                            (transferChangeStorage + transferChangeCounter) AS \`change\`
                        FROM event_transfers
                        WHERE transferRefEvent = ?) AS changes 
                    INNER JOIN products ON (transferRefProduct = productId)
                    INNER JOIN size_types ON (transferRefSizeType = sizeTypeId)
                    INNER JOIN product_categories ON (productRefCategory = categoryId)
                    INNER JOIN product_units ON (sizeTypeRefUnit = unitId)
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

    static countCurrentTransfersByProductId(productId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT COUNT(*) AS counter
                    FROM event_transfers
                    WHERE transferRefProduct = ?`;
        mysql.conn.query(query, productId, (err, row, fields) => {
            if (err) {
                return callback(err);
            }
            return callback(null, row[0]);
        });
    };

    static countCurrentTransfersByProductAndSizeTypeId(productId: number, sizeTypeId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT COUNT(*) AS counter
                    FROM event_transfers
                    WHERE transferRefProduct = ? AND transferRefSizeType = ?`;
        mysql.conn.query(query, [productId, sizeTypeId], (err, row, fields) => {
            if (err) {
                return callback(err);
            }
            return callback(null, row[0]);
        });
    };

    static getTransactionsByEventId(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM event_transactions
                        WHERE transactionRefEvent = ?) AS transactions
                    INNER JOIN products ON (transactionRefProduct = productId)
                    INNER JOIN size_types ON (transactionRefSizeType = sizeTypeId)
                    INNER JOIN product_categories ON (productRefCategory = categoryId)
                    INNER JOIN product_units ON (sizeTypeRefUnit = unitId)
                    ORDER BY transactionId ASC`;
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
                        SELECT transactionRefEvent, (SUM(transactionChangeTotal * sizeDeliveryCosts) * (-1)) AS costs
                        FROM (
                            SELECT transactionRefEvent, transactionRefProduct, transactionRefSizeType, transactionChangeTotal
                            FROM event_transactions
                            WHERE transactionRefEvent = ?) AS transactions
                        INNER JOIN product_sizes ON (sizeRefProduct = transactionRefProduct AND sizeRefSizeType = transactionRefSizeType)) AS costsTable
                    INNER JOIN events ON (transactionRefEvent = eventId)`;
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

    static getTransferCosts(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT (SUM(changes * sizeDeliveryCosts) * (-1)) AS costs
                    FROM (
                        SELECT transferRefEvent, transferRefProduct, transferRefSizeType, (transferChangeStorage + transferChangeCounter) AS changes
                        FROM event_transfers
                        WHERE transferRefEvent = ?) AS transfers
                    INNER JOIN product_sizes ON (sizeRefProduct = transferRefProduct AND sizeRefSizeType = transferRefSizeType)`;
        mysql.conn.query(query, eventId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows[0]) {
                return callback(null, false);
            }
            return callback(null, rows[0]);
        });
    }
}
