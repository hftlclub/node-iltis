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
}
