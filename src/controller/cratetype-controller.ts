import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { CrateType, CrateTypeFactory } from '../shared/models/cratetype';
import { CrateTypeService } from '../services/cratetype-service';


export class CrateTypeController {

    getAll(req, res, next) {
        let crateTypes: CrateType[] = [];
        CrateTypeService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(crateTypes, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            crateTypes = rows.map(row => CrateTypeFactory.fromObj(row));
            res.send(crateTypes, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.crateTypeId);
        let crateType: CrateType = CrateTypeFactory.empty();
        CrateTypeService.getById(id, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('CrateType does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            crateType = CrateTypeFactory.fromObj(row);
            res.send(crateType, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}