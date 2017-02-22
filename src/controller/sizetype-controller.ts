import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { SizeType, SizeTypeFactory } from '../shared/models/sizetype';
import { SizeTypeService } from '../services/sizetype-service';


export class SizeTypeController {

    getAll(req, res, next) {
        let sizeTypes: SizeType[] = [];
        SizeTypeService.getAll((err, rows)=>{
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(sizeTypes, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            sizeTypes = rows.map(row => SizeTypeFactory.fromObj(row));
            res.send(sizeTypes, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.sizeTypeId);
        let sizeType: SizeType = SizeTypeFactory.empty();
        SizeTypeService.getById(id, (err, row)=>{
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('SizeType does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            sizeType = SizeTypeFactory.fromObj(row);
            res.send(sizeType, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}