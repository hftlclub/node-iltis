let mysql = require('../modules/mysql');

export class HelperService {

    static healthcheck(callback: (healthy: boolean) => void) {
        let query = `SELECT 1`;
        mysql.conn.query(query, (err, rows, fields) => {
            if (err) return callback(false);
            return callback(true);
        });
    }
}
