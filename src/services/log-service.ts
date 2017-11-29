import { Request } from 'restify';
import { LogFactory } from '../shared/models/log';
let mysql = require('../modules/mysql');

export class LogService {

    static addLogEntry(code: number, refId: number, payload: any, user?: string) {
        let query = `INSERT INTO logs SET ?`;
        let log = user ? LogFactory.toDbObject(code, refId, payload, user) : LogFactory.toDbObject(code, refId, payload);
        mysql.conn.query(query, log, (err, result) => {
            if (err) { console.log(err); }
        });
    };
}
