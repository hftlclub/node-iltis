import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Inventory } from '../shared/models/inventory/inventory';
import { InventoryFactory } from '../shared/models/inventory/inventory-factory';
import { InventoryService } from '../services/inventory-service';


export class InventoryController {

    constructor(private inventoryService: InventoryService) {}

    getCurrent(req, res, next) {
        let inventory: Inventory[] = [];
        this.inventoryService.getCurrent((err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            inventory = rows1.map(row => InventoryFactory.fromObj(row));
            res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getByEventId(req, res, next) {
        let id = parseInt(req.params.eventId);
        let inventory: Inventory[] = [];
        this.inventoryService.getByEventId(id, (err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            inventory = rows1.map(row => InventoryFactory.fromObj(row));
            res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}