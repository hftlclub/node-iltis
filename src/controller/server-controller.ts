import { Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';

let pjson = require('../../package.json');
let fs = require('fs');

export class ServerController {

    info(req: Request, res: Response, next: Next) {
        let info = {
            version: pjson.version,
            time: process.uptime()
        };
        res.send(info, ContentType.ApplicationJSON);
        next();
    }
}
