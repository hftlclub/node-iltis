import { NotFoundError, BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { SizeType, SizeTypeFactory } from '../shared/models/sizetype';
import { SizeTypeService } from '../services/sizetype-service';


export class SizeTypeController {

    // GET: Return all SizeTypes
    getAll(req: Request, res: Response, next: Next) {
        SizeTypeService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let sizeTypes: SizeType[] = rows.map(row => SizeTypeFactory.fromObj(row));
            res.send(sizeTypes, ContentType.ApplicationJSON);
        });
    };

    // GET: Return single SizeType
    getById(req: Request, res: Response, next: Next) {
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        let sizeType: SizeType = SizeTypeFactory.empty();
        SizeTypeService.getById(sizeTypeId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid sizeTypeId'));
            if (!row) {
                next(new NotFoundError('SizeType does not exist'));
            }
            sizeType = SizeTypeFactory.fromObj(row);
            res.send(sizeType, ContentType.ApplicationJSON);
        });
    };

    // POST: Add new SizeType
    addSizeType(req: Request, res: Response, next: Next) {
        SizeTypeService.addSizeType(SizeTypeFactory.toDbObject(req.body), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                SizeTypeService.getById(result.insertId, (err, row) => {
                    if (err) return next(new InternalError());
                    res.send(201, SizeTypeFactory.fromObj(row), ContentType.ApplicationJSON);
                });
            } else next(new InternalError());
        });
    };
}
