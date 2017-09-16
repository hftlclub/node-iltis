import { Request } from 'restify';
import { LogFactory } from '../shared/models/log';
let mysql = require('../modules/mysql');

export class LogService {

    static addLogEntry(req: Request, result: any) {
        let query = `INSERT INTO logs SET ?`;
        let log = LogFactory.toDbObject(req, result);
        mysql.conn.query(query, log, (err, result) => {
            if (err) { console.log(err); }
        });
    };
}
