let mysql = require('../modules/mysql');

export class InventoryService {

    static getCurrent(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT refProduct, refSizeType, productId, refCategory, refUnit, productName,
                            productDesc, productImgFilename, productActive, productDeleted,
                            productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted ,
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
                    INNER JOIN product_units ON (refUnit = unitId)`;
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

    static getByEventId(id: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM (
                            SELECT refProduct, refSizeType, productId, refCategory, refUnit, productName,
                            productDesc, productImgFilename, productActive, productDeleted,
                            productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted ,
                            Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storage,
                            Sum(transactionChangeCounter) AS counter
                            FROM (
                                SELECT *
                                FROM transactions
                                INNER JOIN products ON (refProduct = productId)) AS transactionsProducts
                            INNER JOIN size_types ON (refSizeType = sizeTypeId)
                            WHERE refEvent <= ?
                            GROUP BY refProduct, refSizeType) AS inventoryWithoutCosts
                        WHERE productActive = true) AS inventoryWithCosts
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

    static getTransferInventoryByEventId(id: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT refProduct, refSizeType, productId, refCategory, refUnit, productName,
                    productDesc, productImgFilename, productActive, productDeleted,
                    productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
                    (storageInventory + SUM(transferChangeStorage)) AS storage,
                    (counterInventory + SUM(transferChangeCounter)) AS counter
                    FROM (
                        SELECT *
                        FROM (
                            SELECT *
                            FROM (
                                SELECT productId, refCategory, refUnit, productName,
                                productDesc, productImgFilename, productActive, productDeleted,
                                productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted ,
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
                    GROUP BY refProduct, refSizeType`;
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
