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

        if (obj.code) log.code = obj.code;
        else if (ValueChecker.validNumber(obj.logCode)) {
            log.code = obj.logCode;
        }

        if (obj.refId) log.refId = obj.refId;
        else if (ValueChecker.validNumber(obj.logRefId)) {
            log.refId = obj.logRefId;
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

    static toDbObject(code: number, refId: number, payload?: any): any {
        let dbEntry: any = {};

        dbEntry.logCode = code;
        dbEntry.logRefId = refId;
        if (payload) {
            try {
                dbEntry.logPayload = JSON.stringify(payload);
            } catch {
                dbEntry.logPayload = payload;
            }
        }

        return dbEntry;
    }
}
