let mysql = require('../modules/mysql');

export class InventoryService {

    // TODO: OPTIMIZE!
    static getCurrent(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT productId, productName, productDesc, productImgFilename, productActive, productDeleted, productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted, storage, counter, categoryId, categoryName, categoryDesc, categoryDeleted, unitId, unitShort, unitFull
                        FROM (
                            SELECT *
                            FROM (
                                SELECT productId, productRefCategory, productRefUnit, productName,
                                productDesc, productImgFilename, productActive, productDeleted,
                                productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                                Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storage,
                                Sum(transactionChangeCounter) AS counter
                                FROM (
                                    SELECT transactionId, transactionRefEvent, transactionRefProduct, transactionRefSizeType, transactionChangeTotal,
                                        transactionChangeCounter, transactionTS, productId, productRefCategory, productName, 
                                        productDesc, productImgFilename, productActive, productDeleted, productTS
                                    FROM event_transactions
                                    INNER JOIN products ON (transactionRefProduct = productId)) AS transactionsProducts
                                INNER JOIN size_types ON (transactionRefSizeType = sizeTypeId)
                                GROUP BY transactionRefProduct, transactionRefSizeType) AS inventoryWithoutCosts
                            WHERE productActive = true) AS inventoryWithCosts
                        INNER JOIN product_categories ON (productRefCategory = categoryId)
                        INNER JOIN product_units ON (productRefUnit = unitId)) AS inventoryAll
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

    // TODO: OPTIMIZE!
    static getByEventId(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT transactionRefEvent, productId, productRefCategory, productRefUnit, productName,
                            productDesc, productImgFilename, productActive, productDeleted,
                            productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                            Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storage,
                            Sum(transactionChangeCounter) AS counter
                            FROM (
                                SELECT *
                                FROM (
                                    SELECT dateOfEvent, transactionId, transactionRefEvent, transactionRefProduct, transactionRefSizeType, transactionChangeTotal,
                                        transactionChangeCounter, transactionTS, productId, productRefCategory, productName, 
                                        productDesc, productImgFilename, productActive, productDeleted, productTS
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
                    INNER JOIN product_units ON (productRefUnit = unitId)
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

    // TODO: OPTIMIZE!
    static getTransferInventoryByEventId(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM ( 
                        SELECT productId, categoryId, unitId, productName,
                        productDesc, productImgFilename, productActive, productDeleted,
                        productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                        (storageInventory + SUM(transferChangeStorage)) AS storage,
                        (counterInventory + SUM(transferChangeCounter)) AS counter
                        FROM (
                            SELECT productId, productName, productDesc, productImgFilename, productActive, productDeleted, productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted, storageInventory, counterInventory, categoryId, categoryName, categoryDesc, categoryDeleted, unitId, unitShort, unitFull
                            FROM (
                                SELECT *
                                FROM (
                                    SELECT productId, productRefCategory, productRefUnit, productName,
                                    productDesc, productImgFilename, productActive, productDeleted,
                                    productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                                    Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storageInventory,
                                    Sum(transactionChangeCounter) AS counterInventory
                                    FROM (
                                        SELECT transactionId, transactionRefEvent, transactionRefProduct, transactionRefSizeType, transactionChangeTotal,
                                            transactionChangeCounter, transactionTS, productId, productRefCategory, productName, 
                                            productDesc, productImgFilename, productActive, productDeleted, productTS
                                        FROM event_transactions
                                        INNER JOIN products ON (transactionRefProduct = productId)) AS transactionsProducts
                                    INNER JOIN size_types ON (transactionRefSizeType = sizeTypeId)
                                    GROUP BY transactionRefProduct, transactionRefSizeType) AS inventoryWithoutCosts
                                WHERE productActive = true) AS inventoryWithCosts
                            INNER JOIN product_categories ON (productRefCategory = categoryId)
                            INNER JOIN product_units ON (productRefUnit = unitId)) AS inventory
                        INNER JOIN event_transfers ON (transferRefSizeType = sizeTypeId AND transferRefProduct = productId)
                        WHERE transferRefEvent = ?
                        GROUP BY transferRefProduct, transferRefSizeType) AS transferInventoryAll
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
