import { NotFoundError, BadRequestError, InternalError } from 'restify';

import { ContentType } from '../contenttype';
import { CrateType, CrateTypeFactory } from '../shared/models/cratetype';
import { CrateTypeService } from '../services/cratetype-service';


export class CrateTypeController {

    // GET: Return all CrateTypes
    getAll(req, res, next) {
        CrateTypeService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let crateTypes: CrateType[] = rows.map(row => CrateTypeFactory.fromObj(row));
            res.send(crateTypes, ContentType.ApplicationJSON);
        });
    };

    // GET: Return single CrateType
    getById(req, res, next) {
        let crateTypeId = parseInt(req.params.crateTypeId, 0);
        let crateType: CrateType = CrateTypeFactory.empty();
        CrateTypeService.getById(crateTypeId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid crateTypeId'));
            if (!row) {
                next(new NotFoundError('CrateType does not exist'));
            }
            crateType = CrateTypeFactory.fromObj(row);
            res.send(crateType, ContentType.ApplicationJSON);
        });
    };
}
