import { CrateTypeFactory } from './../shared/models/cratetype/cratetype-factory';
let mysql = require('../modules/mysql');

export class CrateTypeService {

    static getAll(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM size_types
                    INNER JOIN product_units ON (unitId = sizeTypeRefUnit)
                    INNER JOIN crate_types ON(sizeTypeId = crateTypeRefSizeType)
                    ORDER BY crateTypeDesc ASC`;
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

    static getById(crateTypeId: number, callback: (err: any, row?: any ) => void) {
        let query = `SELECT *
                    FROM size_types
                    INNER JOIN product_units ON (unitId = sizeTypeRefUnit)
                    INNER JOIN crate_types ON(sizeTypeId = crateTypeRefSizeType)
                    WHERE crateTypeId = ?`;
        mysql.conn.query(query, crateTypeId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows[0]) {
                return callback(null, false);
            }
            return callback(null, rows[0]);
        });
    };

    static getProductsCrates(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM crate_types
                    INNER JOIN product_crates ON (crateTypeId = crateRefCrateType)
                    INNER JOIN size_types ON (sizeTypeId = crateTypeRefSizeType)
                    INNER JOIN product_units ON (unitId = sizeTypeRefUnit)
                    ORDER BY crateTypeSlots DESC`;
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

    static getProductCratesByProductId(productId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM (
                        SELECT *
                        FROM size_types
                        INNER JOIN product_units ON (unitId = sizeTypeRefUnit)
                        INNER JOIN crate_types ON(sizeTypeId = crateTypeRefSizeType)) AS sizeCrates
                    INNER JOIN product_crates ON(crateTypeId = crateRefCrateType)
                    WHERE crateRefProduct = ?
                    ORDER BY crateTypeSlots DESC`;
        mysql.conn.query(query, productId, (err, rows, fields) => {
            if (err) {
                console.log(err);
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };

    static addCrateType(crateType: any, callback: (err: any, result?: any) => void) {
        let query = `INSERT INTO crate_types SET ?`;
        mysql.conn.query(query, crateType, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static updateCrateType(crateType: any, callback: (err: any, result?: any) => void) {
        let query = `UPDATE crate_types SET ?
                    WHERE crateTypeId = ?`;
        mysql.conn.query(query, [crateType, crateType.crateTypeId], (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static deleteCrateType(crateTypeId: number, callback: (err: any, result?: any) => void) {
        let query = `DELETE FROM crate_types
                    WHERE crateTypeId = ?`;
        mysql.conn.query(query, crateTypeId, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };
}
