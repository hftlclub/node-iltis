import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { ContentType } from '../contenttype';
import { Unit, UnitFactory } from '../shared/models/unit';
import { UnitService } from '../services/unit-service';


export class UnitController {

    getAll(req, res, next) {
        let units: Unit[] = [];
        UnitService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(units, ContentType.ApplicationJSON);
            }
            units = rows.map(row => UnitFactory.fromObj(row));
            res.send(units, ContentType.ApplicationJSON);
        });
    };

    getById(req, res, next) {
        let unitId = parseInt(req.params.unitId, 0);
        let unit: Unit = UnitFactory.empty();
        UnitService.getById(unitId, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                next(new NotFoundError('Unit does not exist'));
            }
            unit = UnitFactory.fromObj(row);
            res.send(unit, ContentType.ApplicationJSON);
        });
    };
}
