import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { ContentType } from '../contenttype';
import { CrateType, CrateTypeFactory } from '../shared/models/cratetype';
import { CrateTypeService } from '../services/cratetype-service';


export class CrateTypeController {

    getAll(req, res, next) {
        let crateTypes: CrateType[] = [];
        CrateTypeService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(crateTypes, ContentType.ApplicationJSON);
            }
            crateTypes = rows.map(row => CrateTypeFactory.fromObj(row));
            res.send(crateTypes, ContentType.ApplicationJSON);
        });
    };

    getById(req, res, next) {
        let crateTypeId = parseInt(req.params.crateTypeId, 0);
        let crateType: CrateType = CrateTypeFactory.empty();
        CrateTypeService.getById(crateTypeId, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                next(new NotFoundError('CrateType does not exist'));
            }
            crateType = CrateTypeFactory.fromObj(row);
            res.send(crateType, ContentType.ApplicationJSON);
        });
    };
}
