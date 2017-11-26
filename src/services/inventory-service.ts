let mysql = require('../modules/mysql');

export class InventoryService {

    static getCurrent(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT productId, productRefCategory, sizeTypeRefUnit, productName,
                        productDesc, productImgFilename, productActive, productDeleted,
                        productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                        Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storage,
                        Sum(transactionChangeCounter) AS counter
                        FROM (
                            SELECT *
                            FROM event_transactions
                            INNER JOIN products ON (transactionRefProduct = productId)
                            INNER JOIN size_types ON (transactionRefSizeType = sizeTypeId)) AS transactions
                        WHERE productActive = true
                        GROUP BY transactionRefProduct, transactionRefSizeType) AS inventoryWithCosts
                    INNER JOIN product_categories ON (productRefCategory = categoryId)
                    INNER JOIN product_units ON (sizeTypeRefUnit = unitId)
                    INNER JOIN product_sizes ON (productId = sizeRefProduct AND sizeTypeId = sizeRefSizeType)
                    WHERE sizeActive = true OR storage > 0 OR counter > 0`;
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

    static getByEventId(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT transactionRefEvent, productId, productRefCategory, sizeTypeRefUnit, productName,
                            productDesc, productImgFilename, productActive, productDeleted,
                            productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                            Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storage,
                            Sum(transactionChangeCounter) AS counter
                            FROM (
                                SELECT *
                                FROM (
                                    SELECT *
                                    FROM (
                                        SELECT eventDT as dateOfEvent
                                        FROM events
                                        WHERE eventId = ?) AS eventDate
                                    INNER JOIN event_transactions
                                    INNER JOIN products ON (transactionRefProduct = productId)) AS eventTransactions
                                INNER JOIN size_types ON (transactionRefSizeType = sizeTypeId)
                                INNER JOIN events ON (eventId = transactionRefEvent)) AS tpse
                            WHERE eventDT <= dateOfEvent
                            GROUP BY productId, transactionRefSizeType) AS inventoryWithoutCosts
                        WHERE storage != 0 OR counter != 0) AS inventoryWithCosts
                    INNER JOIN product_categories ON (productRefCategory = categoryId)
                    INNER JOIN product_units ON (sizeTypeRefUnit = unitId)
                    INNER JOIN product_sizes ON (productId = sizeRefProduct AND sizeTypeId = sizeRefSizeType)`;
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

    static getTransferInventoryByEventId(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT productId, productName,
                        productDesc, productRefCategory, productImgFilename, productActive, productDeleted,
                        productTS, sizeTypeId, sizeTypeRefUnit, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                        (storageInventory + SUM(transferChangeStorage)) AS storage,
                        (counterInventory + SUM(transferChangeCounter)) AS counter
                        FROM (
                            SELECT productId, productName,
                            productDesc, productRefCategory, productImgFilename, productActive, productDeleted,
                            productTS, sizeTypeId, sizeTypeRefUnit, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                            Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storageInventory,
                            Sum(transactionChangeCounter) AS counterInventory
                            FROM (
                                SELECT *
                                FROM event_transactions
                                INNER JOIN products ON (transactionRefProduct = productId)
                                WHERE productActive = true) AS transactionsProducts
                            INNER JOIN size_types ON (transactionRefSizeType = sizeTypeId)
                            GROUP BY transactionRefProduct, transactionRefSizeType) AS inventoryWithCosts
                        INNER JOIN event_transfers ON (transferRefSizeType = sizeTypeId AND transferRefProduct = productId)
                        WHERE transferRefEvent = ?
                        GROUP BY transferRefProduct, transferRefSizeType) AS transferInventoryAll
                    INNER JOIN product_units ON (sizeTypeRefUnit = unitId)
                    INNER JOIN product_categories ON (productRefCategory = categoryId)
                    INNER JOIN product_sizes ON (productId = sizeRefProduct AND sizeTypeId = sizeRefSizeType)
                    WHERE sizeActive = true OR storage > 0 OR counter > 0`;
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
}
