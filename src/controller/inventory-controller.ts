import { NotFoundError, BadRequestError, ConflictError, InternalError } from 'restify';

import { ContentType } from '../contenttype';
import { Inventory, InventoryFactory } from '../shared/models/inventory';
import { InventoryService } from '../services/inventory-service';


export class InventoryController {

    getCurrent(req, res, next) {
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send(204);
            let inventory: Inventory[] = rows.map(row => InventoryFactory.fromObj(row));
            res.send(inventory, ContentType.ApplicationJSON);
        });
    };

    getByEventId(req, res, next) {
        let eventId = parseInt(req.params.eventId, 0);
        InventoryService.getByEventId(eventId, (err, rows) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!rows.length) res.send(204);
            let inventory: Inventory[] = rows.map(row => InventoryFactory.fromObj(row));
            res.send(inventory, ContentType.ApplicationJSON);
        });
    };
}
