import { BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { Inventory, InventoryFactory } from '../shared/models/inventory';
import { InventoryService } from '../services/inventory-service';


export class InventoryController {

    // GET: Return current inventory
    getCurrent(req: Request, res: Response, next: Next) {
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let inventory: Inventory[] = rows.map(row => InventoryFactory.fromObj(row));
            res.send(inventory, ContentType.ApplicationJSON);
        });
    };

    // GET: Return inventory by closed event
    getByEventId(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        InventoryService.getByEventId(eventId, (err, rows) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let inventory: Inventory[] = rows.map(row => InventoryFactory.fromObj(row));
            res.send(inventory, ContentType.ApplicationJSON);
        });
    };
}
