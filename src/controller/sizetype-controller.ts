import { LogService } from './../services/log-service';
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
            if (result.amount === 0) return next(new BadRequestError('Invalid amount'));
            if (result) {
                SizeTypeService.getById(result.insertId, (err, row) => {
                    if (err) return next(new InternalError());
                    LogService.addLogEntry(300, result.insertId, SizeTypeFactory.fromObj(row));
                    res.send(201, SizeTypeFactory.fromObj(row), ContentType.ApplicationJSON);
                });
            } else next(new InternalError());
        });
    };

    // PUT: Update SizeType
    updateSizeType(req: Request, res: Response, next: Next) {
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        let updatedSizeType: any = SizeTypeFactory.toDbObject(req.body);
        updatedSizeType.sizeTypeId = sizeTypeId;
        delete updatedSizeType.sizeTypeAmount;
        delete updatedSizeType.sizeTypeDeleted;
        SizeTypeService.updateSizeType(updatedSizeType, (err, result) => {
            if (err || !result) return next(new BadRequestError());
            if (result.amount === 0) return next(new BadRequestError('Invalid amount'));
            LogService.addLogEntry(301, sizeTypeId, req.body);
            res.send(204);
        });
    };

    // DELETE: Remove SizeType
    deleteSizeType(req: Request, res: Response, next: Next) {
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        SizeTypeService.deleteSizeType(sizeTypeId, (err, result) => {
            if (err || !result) return next(new NotFoundError());
            LogService.addLogEntry(302, sizeTypeId);
            res.send(204);
        });
    };
}
