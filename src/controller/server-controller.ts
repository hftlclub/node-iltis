import { Request, Response, Next, ServiceUnavailableError } from 'restify';
import { HelperService } from './../services/helper-service';
import { ContentType } from '../contenttype';

let pjson = require('../../package.json');
let fs = require('fs');

export class ServerController {

    info(req: Request, res: Response, next: Next) {
        require('child_process').exec('git rev-parse HEAD', (err, stdout) => {
            let info = {
                version: pjson.version,
                commit: stdout,
                time: process.uptime()
            };
            res.send(info, ContentType.ApplicationJSON);
            next();
        });
    }

    healthcheck(req: Request, res: Response, next: Next) {
        HelperService.healthcheck(healthy => {
            if (!healthy) return next(new ServiceUnavailableError());
            res.send(200);
        });
    }
}
