import { NotFoundError, BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { Unit, UnitFactory } from '../shared/models/unit';
import { UnitService } from '../services/unit-service';


export class UnitController {

    // GET: Return all units
    getAll(req: Request, res: Response, next: Next) {
        UnitService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let units: Unit[] = rows.map(row => UnitFactory.fromObj(row));
            res.send(units, ContentType.ApplicationJSON);
        });
    };

    // GET: Return single unit
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
}
