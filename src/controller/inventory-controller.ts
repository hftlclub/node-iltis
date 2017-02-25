import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { Inventory, InventoryFactory } from '../shared/models/inventory';
import { InventoryService } from '../services/inventory-service';


export class InventoryController {

    getCurrent(req, res, next) {
        let inventory: Inventory[] = [];
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            inventory = rows.map(row => InventoryFactory.fromObj(row));
            res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getByEventId(req, res, next) {
        let eventId = parseInt(req.params.eventId, 0);
        let inventory: Inventory[] = [];
        InventoryService.getByEventId(eventId, (err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            inventory = rows.map(row => InventoryFactory.fromObj(row));
            res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}
