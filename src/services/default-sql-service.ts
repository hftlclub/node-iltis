var mysql = require('../modules/mysql');

export class DefaultSqlService {

    // Todo: Call default sql methods from services! 

    static getAll(table : string, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM ?;';
        mysql.conn.query(query, table, (err, rows, fields) => {
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
