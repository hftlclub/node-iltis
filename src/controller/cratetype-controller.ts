import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Validator } from '../modules/validator';
import { CrateType } from '../models/crateType/cratetype';
import { SizeType } from '../models/sizetype/sizetype';
import { CrateTypeFactory } from '../models/cratetype/cratetype-factory';
import { CrateTypeService } from '../services/cratetype-service';
import { SizeTypeFactory } from '../models/sizetype/sizetype-factory';
import { SizeTypeService } from '../services/sizetype-service';


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
                crateTypes = rows1.map(row => CrateTypeFactory.fromObj(row));
                this.sizeTypeService.joinCrateTypes((err, rows2) => {
                    if (err) return next(err);
                    else { 
                        var sizeTypes : SizeType[] = rows2.map(row => SizeTypeFactory.fromObj(row));

                        crateTypes = crateTypes.map(c => {
                            c.sizeType = sizeTypes.find(f => f.id === c.sizeType.id);
                            return c;
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
        this.crateTypeService.getById(id, (err, row1) => {
            if (err) return next(err);
            if (!row1) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('CrateType does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            else { 
                crateType = CrateTypeFactory.fromObj(row1);
                this.sizeTypeService.getById(row1.refSize, (err, row2)=>{
                    if (err) return next(err);
                    else {
                        crateType.sizeType = SizeTypeFactory.fromObj(row2);
                        res.send(crateType, { 'Content-Type': 'application/json; charset=utf-8' });
                    }
                });
            }
        });
    };
}