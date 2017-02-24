import { NotFoundError, BadRequestError, ConflictError, InternalError} from 'restify';

import { Event, EventFactory } from '../shared/models/event';
import { Transfer, TransferFactory } from '../shared/models/transfer';
import { Transaction, TransactionFactory } from '../shared/models/transaction';
import { CalculationFactory } from '../shared/models/calculation';
import { EventService } from '../services/event-service';
import { Inventory, InventoryFactory} from './../shared/models/inventory';
import { InventoryService } from './../services/inventory-service';


export class EventController {

    addEvent(req, res, next) {
        EventService.addEvent(EventFactory.fromModel(req.body), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                EventService.getById(result.insertId, (err, row) => {
                    if (err) return next(err);
                    res.send(201, EventFactory.fromObj(row), {'Content-Type': 'application/json; charset=utf-8'});
                });
            } else res.send(new InternalError());
        });
    };

    updateEvent(req, res, next) {
        let id = parseInt(req.context.eventId, 0);
        let updatedEvent: any = EventFactory.fromModel(req.body);
        updatedEvent.eventId = id;
        delete updatedEvent.eventTS;
        delete updatedEvent.eventActive;
        delete updatedEvent.eventCountedCounter;
        delete updatedEvent.eventCountedStorage;
        EventService.updateEvent(updatedEvent, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) res.send(204);
            else res.send(new InternalError());
        });
    };

    addTransferStorageOut(req, res, next) {
        this.addTransfer(req, res, next, true, -1);
    };

    addTransferStorageIn(req, res, next) {
        this.addTransfer(req, res, next, true, 1);
    };

    addTransferCounterOut(req, res, next) {
        this.addTransfer(req, res, next, false, -1);
    };

    private addTransfer(req, res, next, isStorageChange, sign) {
        let eventId = parseInt(req.context.eventId, 0);
        let transfers: any[] = [];
        req.body.forEach(obj => {
            if (obj.change != 0) transfers.push(TransferFactory.fromTransferModel(obj, eventId, true, -1));
        });
        EventService.addTransfers(transfers, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                EventService.getLastTransfers(eventId, result.insertId, (err, rows) => {
                    if (err) return next(err);
                    transfers = rows.map(row => TransferFactory.fromObj(row));
                    res.send(201, transfers, {'Content-Type': 'application/json; charset=utf-8'});
                });
            } else res.send(new InternalError());
        });
    };

    countStorage(req, res, next) {
            this.deleteTransfers(req, res, next, true);
    }

    countCounter(req, res, next) {
            this.deleteTransfers(req, res, next, false);
    }

    private deleteTransfers(req, res, next, isStorageChange) {
        let eventId = parseInt(req.context.eventId, 0);
        if (isStorageChange) {
            EventService.deleteStorageTransfers(eventId, (err, result) => {
                if (err) return next();
                if (result) {
                    this.countInventory(req, res, next, isStorageChange, eventId);
                }
            });
        } else {
            EventService.deleteCounterTransfers(eventId, (err, result) => {
                if (err) return next();
                if (result) {
                    this.countInventory(req, res, next, isStorageChange, eventId);
                }
            });
        }
    }

    private countInventory(req, res, next, isStorageChange, eventId) {
        let transfers: any[] = [];
        transfers = req.body.map(obj => TransferFactory.fromTransferModel(obj, eventId, isStorageChange, 1));
        let inventory: Inventory[] = [];
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(err);
            if (rows.length > 0) {
                inventory = rows.map(row => InventoryFactory.fromObj(row));
            }
            inventory.forEach(i => {
                if (isStorageChange) {
                    try {
                        transfers.find(f => (i.product.id === f.refProduct && i.sizeType.id === f.refSizeType)).transferChangeStorage -= i.storage;
                    } catch (e) {}
                } else {
                    try {
                        transfers.find(f => (i.product.id === f.refProduct && i.sizeType.id === f.refSizeType)).transferChangeCounter -= i.counter;
                    } catch (e) {}
                }
            });
            for (let i  = transfers.length - 1; i >= 0; i--) {
                if (transfers[i].transferChangeStorage === 0 && transfers[i].transferChangeCounter === 0) {
                    transfers.splice(i, 1);
                }
            }
            EventService.addTransfers(transfers, (err, result) => {
                if (err) return next(new BadRequestError());
                if (result) {
                    EventService.updateEventCountedValues(eventId, isStorageChange, (err, result) => {
                        if (err) return next(new BadRequestError());
                        if (result) res.send(201);
                        else res.send(new InternalError());
                    });
                } else res.send(new InternalError());
            });
        });
    }

    getAll(req, res, next) {
        let events: Event[] = [];
        EventService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(events, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            events = rows.map(row => EventFactory.fromObj(row));
            res.send(events, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.eventId, 0);
        let event: Event = EventFactory.empty();
        EventService.getById(id, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('Event does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            event = EventFactory.fromObj(row);
            res.send(event, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getEventTransfers(req, res, next) {
        let id = parseInt(req.params.eventId, 0);
        let transfers: Transfer[] = [];
        EventService.getTransfersByEventId(id, (err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            transfers = rows.map(row => TransferFactory.fromObj(row));
            res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getEventStorageTransfers(req, res, next) {
        let id = parseInt(req.params.eventId, 0);
        let transfers: Transfer[] = [];
        EventService.getStorageTransfersByEventId(id, (err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            transfers = rows.map(row => TransferFactory.fromObj(row));
            res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getEventCounterTransfers(req, res, next) {
        let id = parseInt(req.params.eventId, 0);
        let transfers: Transfer[] = [];
        EventService.getCounterTransfersByEventId(id, (err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            transfers = rows.map(row => TransferFactory.fromObj(row));
            res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getEventTransactions(req, res, next) {
        let id = parseInt(req.params.eventId, 0);
        let transactions: Transaction[] = [];
        EventService.getTransactionsByEventId(id, (err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(transactions, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            transactions = rows.map(row => TransactionFactory.fromObj(row));
            res.send(transactions, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getCalculation(req, res, next) {
        let id = parseInt(req.params.eventId, 0);
        let calculation: CalculationFactory = CalculationFactory.empty();
        EventService.getCalculation(id, (err, row) => {
            if (err) return next(err);
            if (!row) {
                res.send(calculation, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            calculation = CalculationFactory.fromObj(row);
            res.send(calculation, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}
