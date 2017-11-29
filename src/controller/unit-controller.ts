import { LogService } from './../services/log-service';
import { NotFoundError, BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { Unit, UnitFactory } from '../shared/models/unit';
import { UnitService } from '../services/unit-service';


export class UnitController {

    // GET: Return all Units
    getAll(req: Request, res: Response, next: Next) {
        UnitService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let units: Unit[] = rows.map(row => UnitFactory.fromObj(row));
            res.send(units, ContentType.ApplicationJSON);
        });
    };

    // GET: Return single Unit
    getById(req: Request, res: Response, next: Next) {
        let unitId = parseInt(req.params.unitId, 0);

        UnitService.getById(unitId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid unitId'));
            if (!row) {
                next(new NotFoundError('Unit does not exist'));
            }
            let unit: Unit = UnitFactory.fromObj(row);
            res.send(unit, ContentType.ApplicationJSON);
        });
    };

    // POST: Add new Unit
    addUnit(req: Request, res: Response, next: Next) {
        UnitService.addUnit(UnitFactory.toDbObject(req.body), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                UnitService.getById(result.insertId, (err, row) => {
                    if (err) return next(new InternalError());
                    LogService.addLogEntry(340, result, UnitFactory.fromObj(row));
                    res.send(201, UnitFactory.fromObj(row), ContentType.ApplicationJSON);
                });
            } else next(new InternalError());
        });
    };

    // PUT: Update Unit
    updateUnit(req: Request, res: Response, next: Next) {
        let unitId = parseInt(req.params.unitId, 0);
        let updatedUnit: any = UnitFactory.toDbObject(req.body);
        updatedUnit.unitId = unitId;
        UnitService.updateUnit(updatedUnit, (err, result) => {
            if (err || !result) return next(new BadRequestError());
            LogService.addLogEntry(341, unitId, req.body);
            res.send(204);
        });
    };

    // DELETE: Remove Unit
    deleteUnit(req: Request, res: Response, next: Next) {
        let unitId = parseInt(req.params.unitId, 0);
        UnitService.deleteUnit(unitId, (err, result) => {
            if (err || !result) return next(new NotFoundError());
            LogService.addLogEntry(342, unitId, null);
            res.send(204);
        });
    };
}
