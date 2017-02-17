import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Validator } from '../modules/validator';
import { SizeType } from '../models/sizetype/sizetype';
import { SizeTypeFactory } from '../models/sizetype/sizetype-factory';
import { SizeTypeService } from '../services/sizetype-service';


export class SizeTypeController {

    constructor(private sizeTypeService: SizeTypeService) { }

    getAll(req, res, next) {
        let sizeTypes: SizeType[] = [];
        this.sizeTypeService.getAll((err, rows)=>{
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
        this.sizeTypeService.getById(id, (err, row)=>{
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