import { Request } from 'restify';
import { LogFactory } from '../shared/models/log';
let mysql = require('../modules/mysql');

export class LogService {

    static addLogEntry(code: number, refId: number, payload?: any) {
        let query = `INSERT INTO logs SET ?`;
        let log = payload ? LogFactory.toDbObject(code, refId, payload) : LogFactory.toDbObject(code, refId);
        mysql.conn.query(query, log, (err, result) => {
            if (err) { console.log(err); }
        });
    };
}
