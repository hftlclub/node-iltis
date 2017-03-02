import { NotFoundError, BadRequestError, ConflictError, InternalError } from 'restify';

import { ContentType } from '../contenttype';
import { SizeType, SizeTypeFactory } from '../shared/models/sizetype';
import { SizeTypeService } from '../services/sizetype-service';


export class SizeTypeController {

    getAll(req, res, next) {
        SizeTypeService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let sizeTypes: SizeType[] = rows.map(row => SizeTypeFactory.fromObj(row));
            res.send(sizeTypes, ContentType.ApplicationJSON);
        });
    };

    getById(req, res, next) {
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        let sizeType: SizeType = SizeTypeFactory.empty();
        SizeTypeService.getById(sizeTypeId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid sizeTypeId'));
            if (!row) {
                next(new NotFoundError('SizeType does not exist'));
            }
            sizeType = SizeTypeFactory.fromObj(row);
            res.send(sizeType, ContentType.ApplicationJSON);
        });
    };
}
