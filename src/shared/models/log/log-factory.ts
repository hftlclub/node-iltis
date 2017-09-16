import { Request } from 'restify';
import { ValueChecker } from '../../valuechecker';
import { Log } from './log';

export class LogFactory {

    static empty(): Log {
        return new Log(0, null, null, null, null, null);
    }

    static fromObj(obj: any): Log {

        let log = LogFactory.empty();

        if (obj.id) log.id = obj.id;
        else if (ValueChecker.validNumber(obj.logId)) {
            log.id = obj.logId;
        }

        if (obj.method) log.method = obj.method;
        else if (ValueChecker.validString(obj.logMethod)) {
            log.method = obj.logMethod.trim();
        }

        if (obj.path) log.path = obj.path;
        else if (ValueChecker.validString(obj.logPath)) {
            log.path = obj.logPath.trim();
        }

        if (obj.payload) log.payload = obj.payload;
        else if (ValueChecker.validString(obj.logPayload)) {
            log.payload = obj.logPayload.trim();
        }

        if (obj.user) log.user = obj.user;
        else if (ValueChecker.validString(obj.logUser)) {
            log.user = obj.logUser.trim();
        }

        if (obj.timestamp) log.timestamp = new Date (obj.timestamp);
        else if (ValueChecker.validDate(obj.logTS)) {
            log.timestamp = obj.logTS;
        }

        return log;
    }

    static toDbObject(req: Request, result: any, user?: string): any {
        let dbEntry: any = {};

        dbEntry.logMethod = req.method;
        dbEntry.logPath = req.getPath();
        dbEntry.logPayload = '';
        if (result.payload) dbEntry.logPayload += JSON.stringify(result.payload);
        if (result.note) dbEntry.logPayload += dbEntry.logPayload.length > 0 ? ' + ' + result.note : result.note;
        if (user) dbEntry.logUser = user;

        return dbEntry;
    }
}
