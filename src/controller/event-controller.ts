import { NotFoundError, BadRequestError, InternalError, ForbiddenError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { Event, EventFactory } from '../shared/models/event';
import { Transfer, TransferFactory } from '../shared/models/transfer';
import { Transaction, TransactionFactory } from '../shared/models/transaction';
import { CalculationFactory, Calculation } from '../shared/models/calculation';
import { EventService } from '../services/event-service';
import { Inventory, InventoryFactory} from './../shared/models/inventory';
import { InventoryService } from './../services/inventory-service';


export class EventController {

    getAll(req: Request, res: Response, next: Next) {
        EventService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let events: Event[] = rows.map(row => EventFactory.fromObj(row));
            res.send(events, ContentType.ApplicationJSON);
        });
    };

    addEvent(req: Request, res: Response, next: Next) {
        EventService.countOpenEventsWithCountAllowed((err, rows) => {
            if (EventFactory.fromObj(req.body).eventType.countAllowed) {
                if (err) return next(new InternalError());
                if (rows[0].count !== 0) return next(new ForbiddenError());
            }
            EventService.addEvent(EventFactory.toDbObject(req.body), (err, result) => {
                if (err) return next(new BadRequestError());
                if (result) {
                    EventService.getById(result.insertId, (err, row) => {
                        if (err) return next(new InternalError());
                        res.send(201, EventFactory.fromObj(row), ContentType.ApplicationJSON);
                    });
                } else next(new InternalError());
            });
        });
    };

    checkPermission(req: Request, res: Response, next: Next) {
        EventService.countOpenEventsWithCountAllowed((err, rows) => {
            if (err) return next(new InternalError());
            let permission = {
                createEventCountAllowed: rows[0].count ? false : true
            };
            res.send(permission, ContentType.ApplicationJSON);
        });
    }

    deleteEvent(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        EventService.deleteEvent(eventId, (err, result) => {
            if (err || !result) return next(new ForbiddenError());
            res.send(204);
        });
    };

    getById(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        let event: Event;
        EventService.getById(eventId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!row) {
                next(new NotFoundError('Event does not exist'));
            }
            event = EventFactory.fromObj(row);
            res.send(event, ContentType.ApplicationJSON);
        });
    };

    updateEvent(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        let updatedEvent: any = EventFactory.toDbObject(req.body);
        updatedEvent.eventId = eventId;
        delete updatedEvent.eventTS;
        delete updatedEvent.eventActive;
        delete updatedEvent.eventCountedCounter;
        delete updatedEvent.eventCountedStorage;
        EventService.updateEvent(updatedEvent, (err, result) => {
            if (err || !result) return next(new BadRequestError());
            res.send(204);
        });
    };

    closeEvent(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        let event: Event;
        EventService.getById(eventId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!row) {
                next(new NotFoundError('Event does not exist'));
            }
            event = EventFactory.fromObj(row);
            if (!event.active) next(new ForbiddenError());
            event.active = false;
            if (event.eventType.countAllowed && event.countedStorage) this.computeParallelTransactions(event, req, res, next);
            else this.addTransactions([], event, req, res, next);
        });
    };

    private computeParallelTransactions(event: Event, req: Request, res: Response, next: Next) {
        EventService.convertTransfersWithCountToTransactions(event.id, (err, transactionsParallel) => {
            if (err) return next(new InternalError());
            this.addTransactions(transactionsParallel, event, req, res, next);
        });
    }

    private addTransactions(transactionsParallel: any[], event: Event, req: Request, res: Response, next: Next) {
        EventService.convertTransfersToTransactions(event.id, (err, transactions) => {
            if (err) return next(new InternalError());
            if (!transactions.length) {
                let dbEvent = EventFactory.toDbObject(event);
                dbEvent.eventId = event.id;
                EventService.updateEvent(dbEvent, (err, result) => {
                    if (err || !result) return next(new InternalError());
                    res.send(204);
                });
            } else {
                if (transactionsParallel.length) {
                    let tNew;
                    transactions.forEach(t => {
                        if (tNew = transactionsParallel.find(tP => tP.refProduct === t.refProduct && tP.refSizeType === t.refSizeType)) {
                            t = tNew;
                        }
                    });
                }
                EventService.addTransactions(transactions, (err, result) => {
                    if (err || !result) return next(new InternalError());
                    this.closeEventAndDeleteTransfers(event, req, res, next);
                });
            }
        });
    }

    private closeEventAndDeleteTransfers(event: Event, req: Request, res: Response, next: Next) {
        let dbEvent = EventFactory.toDbObject(event);
        dbEvent.eventId = event.id;
        EventService.updateEvent(dbEvent, (err, result) => {
            if (err || !result) return next(new InternalError());
            EventService.deleteTransfersByEventId(event.id, (err, result) => {
                if (err || !result) return next(new InternalError());
                res.send(204);
            });
        });
    }

    getEventInventoryTransfers(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let inventory: Inventory[] = rows.map(row => InventoryFactory.fromObj(row));
            let inventoryTransfers: Inventory[] = [];
            InventoryService.getTransferInventoryByEventId(eventId, (err, rows) => {
                if (err) return next(new BadRequestError('Invalid eventId'));
                if (rows.length) {
                    inventoryTransfers = rows.map(row => InventoryFactory.fromObj(row));
                    let iNew;
                    inventory.forEach(iOld => {
                        if (iNew = inventoryTransfers.find(i => iOld.product.id === i.product.id && iOld.sizeType.id === i.sizeType.id)) {
                            iOld.counter = iNew.counter;
                            iOld.storage = iNew.storage;
                        }
                    });
                }
                res.send(inventory, ContentType.ApplicationJSON);
            });
        });
    }

    getEventTransfers(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        EventService.getTransfersByEventId(eventId, (err, rows) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let transfers: Transfer[] = rows.map(row => TransferFactory.fromObj(row));
            res.send(transfers, ContentType.ApplicationJSON);
        });
    };

    addTransferStorageOut(req: Request, res: Response, next: Next) {
        this.addTransfer(req, res, next, true, -1);
    };

    addTransferStorageIn(req: Request, res: Response, next: Next) {
        this.addTransfer(req, res, next, true, 1);
    };

    addTransferCounterOut(req: Request, res: Response, next: Next) {
        this.addTransfer(req, res, next, false, -1);
    };

    private addTransfer(req: Request, res: Response, next: Next, isStorageChange: boolean, sign: number) {
        let eventId = parseInt(req.params.eventId, 0);
        let transfers: any[] = [];
        req.body.forEach(obj => {
            if (obj.change != 0) transfers.push(TransferFactory.toDbObject(obj, eventId, isStorageChange, sign));
        });
        EventService.addTransfers(transfers, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                EventService.getLastTransfers(eventId, result.insertId, (err, rows) => {
                    if (err) return next(new InternalError());
                    transfers = rows.map(row => TransferFactory.fromObj(row));
                    res.send(201, transfers, ContentType.ApplicationJSON);
                });
            } else next(new InternalError());
        });
    };

    countStorage(req: Request, res: Response, next: Next) {
            this.deleteTransfers(req, res, next, true);
    }

    countCounter(req: Request, res: Response, next: Next) {
            this.deleteTransfers(req, res, next, false);
    }

    private deleteTransfers(req: Request, res: Response, next: Next, isStorageChange: boolean) {
        let eventId = parseInt(req.params.eventId, 0);
        EventService.getById(eventId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!EventFactory.fromObj(row).eventType.countAllowed) return next(new ForbiddenError());
            if (isStorageChange) {
                EventService.deleteStorageTransfers(eventId, (err, result) => {
                    if (err || !result) return next(new InternalError());
                    this.countInventory(req, res, next, isStorageChange, eventId);
                });
            } else {
                EventService.deleteCounterTransfers(eventId, (err, result) => {
                    if (err || !result) return next(new InternalError());
                    this.countInventory(req, res, next, isStorageChange, eventId);
                });
            }
        });
    }

    private countInventory(req: Request, res: Response, next: Next, isStorageChange: boolean, eventId: number) {
        let transfers: any[] = [];
        transfers = req.body.map(obj => TransferFactory.toDbObject(obj, eventId, isStorageChange, 1));
        if (!transfers.length) {
            next(new BadRequestError());
        }
        let inventory: Inventory[] = [];
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(new InternalError());
            inventory = rows.map(row => InventoryFactory.fromObj(row));
            let tKey, iKey;
            if (isStorageChange) {
                tKey = 'transferChangeStorage';
                iKey = 'storage';
            } else {
                tKey = 'transferChangeCounter';
                iKey = 'counter';
            }
            transfers = transfers.map(t => {
                let inventoryForTransfer = inventory.find(inv => (inv.product.id === t.refProduct && inv.sizeType.id === t.refSizeType));
                t[tKey] -= inventoryForTransfer[iKey];
                return t;
            });
            transfers = transfers.filter(t => t.transferChangeStorage || t.transferChangeCounter);
            EventService.addTransfers(transfers, (err, result) => {
                if ((err || !result) && transfers.length) return next(new BadRequestError());
                let event: any = { eventId: eventId };
                if (isStorageChange) event.eventCountedStorage = true;
                else event.eventCountedCounter = true;
                EventService.updateEvent(event, (err, result) => {
                    if (err || !result) return next(new InternalError());
                    let transfers: Transfer[] = [];
                    EventService.getTransfersByEventId(eventId, (err, rows) => {
                        if (err) return next(new InternalError());
                        if (!rows.length) {
                            res.send(201, transfers, ContentType.ApplicationJSON);
                        }
                        transfers = rows.map(row => TransferFactory.fromObj(row));
                        res.send(201, transfers, ContentType.ApplicationJSON);
                    });
                });
            });
        });
    }

    getEventTransactions(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        EventService.getTransactionsByEventId(eventId, (err, rows) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let transactions: Transaction[] = rows.map(row => TransactionFactory.fromObj(row));
            res.send(transactions, ContentType.ApplicationJSON);
        });
    };

    getCalculation(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        EventService.getCalculation(eventId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!row) res.send(new NotFoundError('Calculation does not exist'));
            let calculation: CalculationFactory = CalculationFactory.fromObj(row);
            res.send(calculation, ContentType.ApplicationJSON);
        });
    };

    getTransferCosts(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        EventService.getTransferCosts(eventId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid eventId'));
            if (!row) res.send(new NotFoundError('No transfers found for this event'));
            res.send(row, ContentType.ApplicationJSON);
        });
    };
}
