var mysql = require('../modules/mysql');

export class InventoryService {

    getCurrent(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
            + 'FROM ('
                + 'SELECT refProduct, refSizeType, productId, refCategory, refUnit, productName, productDesc, productPriceIntern, productImgFilename, productActive, productDeleted, productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted , Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS \'storage\', Sum(transactionChangeCounter) AS \'counter\' '
                + 'FROM ('
                    + 'SELECT * '
                    + 'FROM transactions '
                    + 'INNER JOIN products ON (refProduct = productId)) AS transactionsProducts '
                + 'INNER JOIN size_types ON (refSizeType = sizeTypeId) '
                + 'GROUP BY refProduct, refSizeType) AS inventory '
            + 'WHERE storage > 0 OR counter > 0;'
        
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

    getByEventId(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * '
            + 'FROM ('
                + 'SELECT refProduct, refSizeType, productId, refCategory, refUnit, productName, productDesc, '
                    + 'productPriceIntern, productImgFilename, productActive, productDeleted, productTS, '
                    + 'sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted , '
                    + 'Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS \'storage\', Sum(transactionChangeCounter) AS \'counter\' '
                + 'FROM ('
                    + 'SELECT * '
                    + 'FROM transactions '
                    + 'INNER JOIN products ON (refProduct = productId)) AS transactionsProducts '
                + 'INNER JOIN size_types ON (refSizeType = sizeTypeId) '
                + 'WHERE refEvent <= ? '
                + 'GROUP BY refProduct, refSizeType) AS inventory '
            + 'WHERE storage > 0 OR counter > 0;'
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