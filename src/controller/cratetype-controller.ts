import { LogService } from './../services/log-service';
import { NotFoundError, BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { CrateType, CrateTypeFactory } from '../shared/models/cratetype';
import { CrateTypeService } from '../services/cratetype-service';


export class CrateTypeController {

    // GET: Return all CrateTypes
    getAll(req: Request, res: Response, next: Next) {
        CrateTypeService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let crateTypes: CrateType[] = rows.map(row => CrateTypeFactory.fromObj(row));
            res.send(crateTypes, ContentType.ApplicationJSON);
        });
    };

    // GET: Return single CrateType
    getById(req: Request, res: Response, next: Next) {
        let crateTypeId = parseInt(req.params.crateTypeId, 0);
        let crateType: CrateType = CrateTypeFactory.empty();
        CrateTypeService.getById(crateTypeId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid crateTypeId'));
            if (!row) {
                next(new NotFoundError('CrateType does not exist'));
            }
            crateType = CrateTypeFactory.fromObj(row);
            res.send(crateType, ContentType.ApplicationJSON);
        });
    };

    // POST: Add new CrateType
    addCrateType(req: Request, res: Response, next: Next) {
        CrateTypeService.addCrateType(CrateTypeFactory.toDbObject(req.body), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result.slots === 0) return next(new BadRequestError('Invalid slots'));
            if (result) {
                CrateTypeService.getById(result.insertId, (err, row) => {
                    if (err) return next(new InternalError());
                    LogService.addLogEntry(req, result);
                    res.send(201, CrateTypeFactory.fromObj(row), ContentType.ApplicationJSON);
                });
            } else next(new InternalError());
        });
    };

    // PUT: Update CrateType
    updateCrateType(req: Request, res: Response, next: Next) {
        let crateTypeId = parseInt(req.params.crateTypeId, 0);
        let updatedCrateType: any = CrateTypeFactory.toDbObject(req.body);
        updatedCrateType.crateTypeId = crateTypeId;
        CrateTypeService.updateCrateType(updatedCrateType, (err, result) => {
            if (err || !result) return next(new BadRequestError());
            if (result.slots === 0) return next(new BadRequestError('Invalid slots'));
            LogService.addLogEntry(req, result);
            res.send(204);
        });
    };

    // DELETE: Remove CrateType
    deleteCrateType(req: Request, res: Response, next: Next) {
        let crateTypeId = parseInt(req.params.crateTypeId, 0);
        CrateTypeService.deleteCrateType(crateTypeId, (err, result) => {
            if (err || !result) return next(new NotFoundError());
            LogService.addLogEntry(req, result);
            res.send(204);
        });
    };
}
