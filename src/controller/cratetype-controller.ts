import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { CrateType } from '../models/crateType/cratetype';
import { SizeType } from '../models/sizeType/sizetype';
import { CrateTypeFactory } from '../models/cratetype/cratetype-factory';
import { CrateTypeService } from '../services/cratetype-service';
import { SizeTypeFactory } from '../models/sizetype/sizetype-factory';
import { SizeTypeService } from '../services/sizetype-service';
import { Validator } from '../modules/validator';

export class CrateTypeController {
    private sizeTypeService : SizeTypeService;

    constructor(private crateTypeService : CrateTypeService) {
        this.sizeTypeService = new SizeTypeService();
    }

    getAll(req, res, next) {
        let crateTypes : CrateType[] = [];
        this.crateTypeService.getAll((err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(crateTypes, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            else {
                crateTypes = rows1.map(row => CrateTypeFactory.fromJson(row));
                this.sizeTypeService.joinCrateTypes((err, rows)=>{
                    if (err) return next(err);
                    else { 
                        var sizeTypes : SizeType[] = rows.map(row => SizeTypeFactory.fromJson(row));
                        // Todo: optimizeable!
                        crateTypes.forEach(crateType => {
                            sizeTypes.forEach(sizeType => {
                                if (crateType.sizeType.id == sizeType.id) {
                                    crateType.sizeType = sizeType;
                                }
                            })
                        });
                        res.send(crateTypes, { 'Content-Type': 'application/json; charset=utf-8' });
                    }
                });
            }
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.crateTypeId);
        let crateType : CrateType = CrateTypeFactory.empty();
        this.crateTypeService.getById(id, (err, row)=>{
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('CrateType does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            else { 
                crateType = CrateTypeFactory.fromJson(row);
                this.sizeTypeService.getById(row.refSize, (err, row)=>{
                    if (err) return next(err);
                    else {
                        crateType.sizeType = SizeTypeFactory.fromJson(row);
                        res.send(crateType, { 'Content-Type': 'application/json; charset=utf-8' });
                    }
                });
            }
        });
    };
}