import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { ContentType } from '../contenttype';
import { SizeType, SizeTypeFactory } from '../shared/models/sizetype';
import { SizeTypeService } from '../services/sizetype-service';


export class SizeTypeController {

    getAll(req, res, next) {
        let sizeTypes: SizeType[] = [];
        SizeTypeService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(sizeTypes, ContentType.ApplicationJSON);
            }
            sizeTypes = rows.map(row => SizeTypeFactory.fromObj(row));
            res.send(sizeTypes, ContentType.ApplicationJSON);
        });
    };

    getById(req, res, next) {
        let sizeTypeId = parseInt(req.params.sizeTypeId, 0);
        let sizeType: SizeType = SizeTypeFactory.empty();
        SizeTypeService.getById(sizeTypeId, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                next(new NotFoundError('SizeType does not exist'));
            }
            sizeType = SizeTypeFactory.fromObj(row);
            res.send(sizeType, ContentType.ApplicationJSON);
        });
    };
}
