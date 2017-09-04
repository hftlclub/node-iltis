import { UnitFactory } from './../shared/models/unit/unit-factory';
import { Unit } from './../shared/models/unit/unit';
let mysql = require('../modules/mysql');

export class UnitService {

    static getAll(callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM product_units
                    ORDER BY unitId ASC`;
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

    static getById(unitId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM product_units
                    WHERE unitId = ?`;
        mysql.conn.query(query, unitId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows[0]) {
                return callback(null, false);
            }
            return callback(null, rows[0]);
        });
    };

    static addUnit(unit: any, callback: (err: any, result?: any) => void) {
        let query = `INSERT INTO product_units SET ?`;
        mysql.conn.query(query, unit, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };

    static updateUnit(unit: any, callback: (err: any, result?: any) => void) {
        let query = `UPDATE product_units SET ?
                    WHERE unitId = ?`;
        mysql.conn.query(query, [unit, unit.unitId], (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };
}
