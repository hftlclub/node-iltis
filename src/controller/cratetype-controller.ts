import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { CrateType } from '../shared/models/crateType/cratetype';
import { CrateTypeFactory } from '../shared/models/cratetype/cratetype-factory';
import { CrateTypeService } from '../services/cratetype-service';


export class CrateTypeController {

    constructor(private crateTypeService: CrateTypeService) {}

    getAll(req, res, next) {
        let crateTypes: CrateType[] = [];
        this.crateTypeService.getAll((err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(crateTypes, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            crateTypes = rows1.map(row => CrateTypeFactory.fromObj(row));
            res.send(crateTypes, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.crateTypeId);
        let crateType: CrateType = CrateTypeFactory.empty();
        this.crateTypeService.getById(id, (err, row1) => {
            if (err) return next(err);
            if (!row1) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('CrateType does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            crateType = CrateTypeFactory.fromObj(row1);
            res.send(crateType, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}