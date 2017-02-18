import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Unit } from '../shared/models/unit/unit';
import { UnitFactory } from '../shared/models/unit/unit-factory';
import { UnitService } from '../services/unit-service';


export class UnitController {

    constructor(private unitService: UnitService) { }

    getAll(req, res, next) {
        let units: Unit[] = [];
        this.unitService.getAll((err, rows)=>{
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
        let id = parseInt(req.params.unitId);
        let unit: Unit = UnitFactory.empty();
        this.unitService.getById(id, (err, row)=>{
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