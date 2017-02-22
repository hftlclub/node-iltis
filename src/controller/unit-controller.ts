import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { Unit, UnitFactory } from '../shared/models/unit';
import { UnitService } from '../services/unit-service';


export class UnitController {

    getAll(req, res, next) {
        let units: Unit[] = [];
        UnitService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(units, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            units = rows.map(row => UnitFactory.fromObj(row));
            res.send(units, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.unitId, 0);
        let unit: Unit = UnitFactory.empty();
        UnitService.getById(id, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('Unit does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            unit = UnitFactory.fromObj(row);
            res.send(unit, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}
