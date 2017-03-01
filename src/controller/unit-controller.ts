import { NotFoundError, BadRequestError, ConflictError, InternalError } from 'restify';

import { ContentType } from '../contenttype';
import { Unit, UnitFactory } from '../shared/models/unit';
import { UnitService } from '../services/unit-service';


export class UnitController {

    getAll(req, res, next) {
        UnitService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send(204);
            let units: Unit[] = rows.map(row => UnitFactory.fromObj(row));
            res.send(units, ContentType.ApplicationJSON);
        });
    };

    getById(req, res, next) {
        let unitId = parseInt(req.params.unitId, 0);
        let unit: Unit = UnitFactory.empty();
        UnitService.getById(unitId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid unitId'));
            if (!row) {
                next(new NotFoundError('Unit does not exist'));
            }
            unit = UnitFactory.fromObj(row);
            res.send(unit, ContentType.ApplicationJSON);
        });
    };
}
