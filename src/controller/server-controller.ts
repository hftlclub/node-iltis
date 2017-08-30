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

    // swagger UI can only handle one scheme, so we have to fix the swagger.json
    getFixedSwaggerJson(req: Request, res: Response, next: Next) {
        fs.readFile('./public/swagger.json', 'utf8', function (err, file: string) {
            if (err) {
                res.send(500);
                return next();
            }
            if (~req.headers.host.indexOf('localhost:3000')) {
                file = file.replace('"https"', '"http"');
            }
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(file),
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.write(file);
            res.end();
            next(false);
        });
    }
}
