let mysql = require('../modules/mysql');

export class InventoryService {

    static getCurrent(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT productId, productName, productDesc, productImgFilename, productActive, productDeleted, productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted, storage, counter, categoryId, categoryName, categoryDesc, categoryDeleted, unitId, unitShort, unitFull
                        FROM (
                            SELECT *
                            FROM (
                                SELECT productId, refCategory, refUnit, productName,
                                productDesc, productImgFilename, productActive, productDeleted,
                                productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                                Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storage,
                                Sum(transactionChangeCounter) AS counter
                                FROM (
                                    SELECT *
                                    FROM transactions
                                    INNER JOIN products ON (refProduct = productId)) AS transactionsProducts
                                INNER JOIN size_types ON (refSizeType = sizeTypeId)
                                GROUP BY refProduct, refSizeType) AS inventoryWithoutCosts
                            WHERE productActive = true) AS inventoryWithCosts
                        INNER JOIN product_categories ON (refCategory = categoryId)
                        INNER JOIN product_units ON (refUnit = unitId)) AS inventoryAll
                    INNER JOIN product_sizes ON (productId = refProduct AND sizeTypeId = refSizeType)
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
                            SELECT refEvent, productId, refCategory, refUnit, productName,
                            productDesc, productImgFilename, productActive, productDeleted,
                            productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                            Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storage,
                            Sum(transactionChangeCounter) AS counter
                            FROM (
                                SELECT *
                                FROM (
                                    SELECT eventDT as dateOfEvent
                                    FROM events
                                    WHERE eventId = ?) AS eventDate
                                INNER JOIN transactions
                                INNER JOIN products ON (refProduct = productId)
                                INNER JOIN size_types ON (refSizeType = sizeTypeId)
                                INNER JOIN events ON (eventId = refEvent)) AS tpse
                            WHERE eventDT <= dateOfEvent
                            GROUP BY productId, refSizeType) AS inventoryWithoutCosts
                        WHERE storage != 0 OR counter != 0) AS inventoryWithCosts
                    INNER JOIN product_categories ON (refCategory = categoryId)
                    INNER JOIN product_units ON (refUnit = unitId)
                    INNER JOIN product_sizes ON (productId = refProduct AND sizeTypeId = refSizeType)`;
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
                                    SELECT productId, refCategory, refUnit, productName,
                                    productDesc, productImgFilename, productActive, productDeleted,
                                    productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                                    Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storageInventory,
                                    Sum(transactionChangeCounter) AS counterInventory
                                    FROM (
                                        SELECT *
                                        FROM transactions
                                        INNER JOIN products ON (refProduct = productId)) AS transactionsProducts
                                    INNER JOIN size_types ON (refSizeType = sizeTypeId)
                                    GROUP BY refProduct, refSizeType) AS inventoryWithoutCosts
                                WHERE productActive = true) AS inventoryWithCosts
                            INNER JOIN product_categories ON (refCategory = categoryId)
                            INNER JOIN product_units ON (refUnit = unitId)) AS inventory
                        INNER JOIN event_transfers ON (refSizeType = sizeTypeId AND refProduct = productId)
                        WHERE refEvent = ?
                        GROUP BY refProduct, refSizeType) AS transferInventoryAll
                    INNER JOIN product_sizes ON (productId = refProduct AND sizeTypeId = refSizeType)
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
