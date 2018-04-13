import { Request, Response, Next, ServiceUnavailableError, ForbiddenError, InternalError } from 'restify';
import { HelperService } from './../services/helper-service';
import { ContentType } from '../contenttype';

let pjson = require('../../package.json');
let fs = require('fs');

export class ServerController {

    info(req: Request, res: Response, next: Next) {
        require('child_process').exec('git rev-parse HEAD', (err, stdout) => {
            HelperService.checkProductionDB(success => {
                let info = {
                    version: pjson.version,
                    commit: stdout.slice(0, -1),
                    time: process.uptime(),
                    production: success
                };
                res.send(info, ContentType.ApplicationJSON);
                next();
            });
        });
    }

    healthcheck(req: Request, res: Response, next: Next) {
        HelperService.healthcheck(healthy => {
            if (!healthy) return next(new ServiceUnavailableError());
            res.send(200);
        });
    }

    initDB(req: Request, res: Response, next: Next) {
        let samples: string = req.query.samples ? req.query.samples : '';
        HelperService.checkInitDB(success => {
            if (!success) return next(new ForbiddenError());
            HelperService.initDB(samples, success => {
                if (!success) return next(new InternalError());
                res.send(200);
            });
        });
    }

    resetDB(req: Request, res: Response, next: Next) {
        let samples: string = req.query.samples ? req.query.samples : '';
        HelperService.checkResetDB(success => {
            if (!success) return next(new ForbiddenError());
            HelperService.resetDB(samples, success => {
                if (!success) return next(new InternalError());
                res.send(200);
            });
        });
    }
}
