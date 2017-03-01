import { NotFoundError, BadRequestError, ConflictError, InternalError, ForbiddenError} from 'restify';

import { ContentType } from '../contenttype';
import { Event, EventFactory } from '../shared/models/event';
import { Transfer, TransferFactory } from '../shared/models/transfer';
import { Transaction, TransactionFactory } from '../shared/models/transaction';
import { CalculationFactory } from '../shared/models/calculation';
import { EventService } from '../services/event-service';
import { Inventory, InventoryFactory} from './../shared/models/inventory';
import { InventoryService } from './../services/inventory-service';


export class EventController {

    addEvent(req, res, next) {
        EventService.countOpenEventsWithCountAllowed((err, rows) => {
            if (EventFactory.fromObj(req.body).eventType.countAllowed) {
                if (err) return next(new InternalError());
                if (rows[0].count !== 0) return next(new BadRequestError());
            }
            EventService.addEvent(EventFactory.toDbObject(req.body), (err, result) => {
                if (err) return next(new BadRequestError());
                if (result) {
                    EventService.getById(result.insertId, (err, row) => {
                        if (err) return next(err);
                        res.send(201, EventFactory.fromObj(row), ContentType.ApplicationJSON);
                    });
                } else next(new InternalError());
            });
        });
    };

    checkPermission(req, res, next) {
        EventService.countOpenEventsWithCountAllowed((err, rows) => {
            if (err) return next(new InternalError());
            let permission = {
                createEventCountAllowed: rows[0].count ? false : true
            };
            res.send(permission, ContentType.ApplicationJSON);
        });
    }

    updateEvent(req, res, next) {
        let eventId = parseInt(req.context.eventId, 0);
        let updatedEvent: any = EventFactory.toDbObject(req.body);
        updatedEvent.eventId = eventId;
        delete updatedEvent.eventTS;
        delete updatedEvent.eventActive;
        delete updatedEvent.eventCountedCounter;
        delete updatedEvent.eventCountedStorage;
        EventService.updateEvent(updatedEvent, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) res.send(204);
            else next(new InternalError());
        });
    };

    closeEvent(req, res, next) {
        let eventId = parseInt(req.context.eventId, 0);
        let event: Event;
        EventService.getById(eventId, (err, row) => {
            if (err) return next(err);
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

    private computeParallelTransactions(event: Event, req, res, next) {
        EventService.convertTransfersWithCountToTransactions(event.id, (err, transactionsParallel) => {
            if (err) return next(err);
            this.addTransactions(transactionsParallel, event, req, res, next);
        });
    }

    private addTransactions(transactionsParallel: any[], event: Event, req, res, next) {
        EventService.convertTransfersToTransactions(event.id, (err, transactions) => {
            if (err) return next(err);
            if (!transactions.length) {
                let dbEvent = EventFactory.toDbObject(event);
                dbEvent.eventId = event.id;
                EventService.updateEvent(dbEvent, (err, result) => {
                    if (err) return next(err);
                    if (result) res.send(204);
                    else next(new InternalError());
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
                    if (err) return next(err);
                    if (result) {
                        this.closeEventAndDeleteTransfers(event, req, res, next);
                    } else next(new InternalError());
                });
            }
        });
    }

    private closeEventAndDeleteTransfers(event: Event, req, res, next) {
        let dbEvent = EventFactory.toDbObject(event);
        dbEvent.eventId = event.id;
        EventService.updateEvent(dbEvent, (err, result) => {
            if (err) return next(err);
            if (result) {
                EventService.deleteTransfersByEventId(event.id, (err, result) => {
                    if (err) return next(err);
                    if (result) res.send(204);
                    else next(new InternalError());
                });
            } else next(new InternalError());
        });
    }

    deleteEvent(req, res, next) {
        let eventId = parseInt(req.context.eventId, 0);
        EventService.deleteEvent(eventId, (err, result) => {
            if (err) return next(new ForbiddenError());
            if (result) res.send(204);
            else next(new InternalError());
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
            if (obj.change != 0) transfers.push(TransferFactory.toDbObject(obj, eventId, true, -1));
        });
        EventService.addTransfers(transfers, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                EventService.getLastTransfers(eventId, result.insertId, (err, rows) => {
                    if (err) return next(err);
                    transfers = rows.map(row => TransferFactory.fromObj(row));
                    res.send(201, transfers, ContentType.ApplicationJSON);
                });
            } else next(new InternalError());
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
        EventService.getById(eventId, (err, rows) => {
            if (err) return next(new BadRequestError());
            if (!EventFactory.fromObj(rows[0]).eventType.countAllowed) return next(new BadRequestError());
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
        });
    }

    private countInventory(req, res, next, isStorageChange, eventId) {
        let transfers: any[] = [];
        transfers = req.body.map(obj => TransferFactory.toDbObject(obj, eventId, isStorageChange, 1));
        if (!transfers.length) {
            next(new BadRequestError());
        }
        let inventory: Inventory[] = [];
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(err);
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
                if (err) return next(new BadRequestError());
                if (result) {
                    let event: any = {};
                    if (isStorageChange) event.eventCountedStorage = true;
                    else event.eventCountedCounter = true;
                    EventService.updateEvent(event, (err, result) => {
                        if (err) return next(new BadRequestError());
                        if (result) {
                            let transfers: Transfer[] = [];
                            EventService.getTransfersByEventId(eventId, (err, rows) => {
                                if (err) return next(err);
                                if (!rows.length) {
                                    res.send(201, transfers, ContentType.ApplicationJSON);
                                }
                                transfers = rows.map(row => TransferFactory.fromObj(row));
                                res.send(201, transfers, ContentType.ApplicationJSON);
                            });
                        } else next(new InternalError());
                    });
                } else next(new InternalError());
            });
        });
    }

    getAll(req, res, next) {
        let events: Event[] = [];
        EventService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(events, ContentType.ApplicationJSON);
            }
            events = rows.map(row => EventFactory.fromObj(row));
            res.send(events, ContentType.ApplicationJSON);
        });
    };

    getById(req, res, next) {
        let eventId = parseInt(req.params.eventId, 0);
        let event: Event;
        EventService.getById(eventId, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                next(new NotFoundError('Event does not exist'));
            }
            event = EventFactory.fromObj(row);
            res.send(event, ContentType.ApplicationJSON);
        });
    };

    getEventTransfers(req, res, next) {
        let eventId = parseInt(req.params.eventId, 0);
        let transfers: Transfer[] = [];
        EventService.getTransfersByEventId(eventId, (err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(transfers, ContentType.ApplicationJSON);
            }
            transfers = rows.map(row => TransferFactory.fromObj(row));
            res.send(transfers, ContentType.ApplicationJSON);
        });
    };

    getEventInventoryTransfers(req, res, next) {
        let eventId = parseInt(req.params.eventId, 0);
        let inventory: Inventory[] = [];
        InventoryService.getCurrent((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(inventory, ContentType.ApplicationJSON);
            }
            inventory = rows.map(row => InventoryFactory.fromObj(row));
            let inventoryTransfers: Inventory[] = [];
            InventoryService.getTransferInventoryByEventId(eventId, (err, rows) => {
                if (err) return next(err);
                if (!rows.length) return next(new NotFoundError());
                inventoryTransfers = rows.map(row => InventoryFactory.fromObj(row));
                let iNew;
                inventory.forEach(iOld => {
                    if (iNew = inventoryTransfers.find(i => iOld.product.id === i.product.id && iOld.sizeType.id === i.sizeType.id)) {
                        iOld.counter = iNew.counter;
                        iOld.storage = iNew.storage;
                    }
                });
                res.send(inventory, ContentType.ApplicationJSON);
            });
        });
    }

    getEventTransactions(req, res, next) {
        let eventId = parseInt(req.params.eventId, 0);
        let transactions: Transaction[] = [];
        EventService.getTransactionsByEventId(eventId, (err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(transactions, ContentType.ApplicationJSON);
            }
            transactions = rows.map(row => TransactionFactory.fromObj(row));
            res.send(transactions, ContentType.ApplicationJSON);
        });
    };

    getCalculation(req, res, next) {
        let eventId = parseInt(req.params.eventId, 0);
        let calculation: CalculationFactory = CalculationFactory.empty();
        EventService.getCalculation(eventId, (err, row) => {
            if (err) return next(err);
            if (!row) {
                res.send(calculation, ContentType.ApplicationJSON);
            }
            calculation = CalculationFactory.fromObj(row);
            res.send(calculation, ContentType.ApplicationJSON);
        });
    };
}
