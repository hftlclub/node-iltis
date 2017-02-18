import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Validator } from '../modules/validator';
import { Event } from '../models/event/event';
import { EventType } from '../models/eventtype/eventtype';
import { Transfer } from '../models/transfer/transfer';
import { TransferFactory } from '../models/transfer/transfer-factory';
import { Transaction } from '../models/transaction/transaction';
import { TransactionFactory } from '../models/transaction/transaction-factory';
import { EventFactory } from '../models/event/event-factory';
import { EventService } from '../services/event-service';
import { EventTypeFactory } from '../models/eventtype/eventtype-factory';
import { EventTypeService } from '../services/eventtype-service';
import { Product } from '../models/product/product';
import { ProductFactory } from '../models/product/product-factory';
import { SizeType } from '../models/sizetype/sizetype';
import { SizeTypeFactory } from '../models/sizetype/sizetype-factory';
import { SizeTypeService } from '../services/sizetype-service';
import { Category } from '../models/category/category';
import { CategoryFactory } from '../models/category/category-factory';
import { CategoryService } from '../services/category-service';
import { Unit } from '../models/unit/unit';
import { UnitFactory } from '../models/unit/unit-factory';
import { UnitService } from '../services/unit-service';


export class EventController {
    private eventTypeService: EventTypeService;
    private categoryService: CategoryService;
    private unitService: UnitService;

    constructor(private eventService: EventService) {
        this.eventTypeService = new EventTypeService();
        this.categoryService = new CategoryService();
        this.unitService = new UnitService();
    }

    getAll(req, res, next) {
        let events: Event[] = [];
        this.eventService.getAll((err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(events, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            events = rows1.map(row => EventFactory.fromObj(row));
            this.eventTypeService.joinEvents((err, rows2) => {
                if (err) return next(err);
                var eventTypes: EventType[] = rows2.map(row => EventTypeFactory.fromObj(row));

                events = events.map(e => {
                    e.eventType = eventTypes.find(f => f.id === e.eventType.id);
                    return e;
                });

                res.send(events, { 'Content-Type': 'application/json; charset=utf-8' });
            });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.eventId);
        let event: Event = EventFactory.empty();
        this.eventService.getById(id, (err, row1) => {
            if (err) return next(err);
            if (!row1) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('Event does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            event = EventFactory.fromObj(row1);
            this.eventTypeService.getById(row1.refEventType, (err, row2)=>{
                if (err) return next(err);
                event.eventType = EventTypeFactory.fromObj(row2);
                res.send(event, { 'Content-Type': 'application/json; charset=utf-8' });
            });
        });
    };

    getEventTransfers(req, res, next) {
        let id = parseInt(req.params.eventId);
        let transfers: Transfer[] = [];
        this.eventService.getTransfersByEventId(id, (err, rows1) => {
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            transfers = rows1.map(row => TransferFactory.fromObj(row));
            this.eventService.joinSizeTypeTransfersByEventId(id, (err, rows2) => {
                if (err) return next(err);
                var sizeTypes: SizeType[] = rows2.map(row => SizeTypeFactory.fromObj(row));
                this.eventService.joinProductTransfersByEventId(id, (err, rows3)=>{
                    if (err) return next(err);
                    var products = rows3.map(row => ProductFactory.fromObj(row));
                    this.categoryService.joinProducts((err, rows4) => {
                        if (err) return next(err);
                        var categories: Category[] = rows4.map(row => CategoryFactory.fromObj(row));
                        this.unitService.joinProducts((err, rows5) => {
                            if (err) return next(err);
                            var units: Unit[] = rows5.map(row => UnitFactory.fromObj(row));

                            products = products.map(p => {
                                p.category = categories.find(f => f.id === p.category.id);
                                return p;
                            }).map(p => {
                                p.unit = units.find(f => f.id === p.unit.id);
                                return p;
                            });

                            transfers = transfers.map(t => {
                                t.sizeType = sizeTypes.find(f => f.id === t.sizeType.id);
                                return t;
                            }).map(i => {
                                i.product = products.find(f => f.id === i.product.id);
                                return i;
                            });

                            res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
                        });
                    });
                });
            });
        });
    };

    getEventTransactions(req, res, next) {
        let id = parseInt(req.params.eventId);
        let transactions: Transaction[] = [];
        this.eventService.getTransactionsByEventId(id, (err, rows1) => {
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(transactions, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            transactions = rows1.map(row => TransactionFactory.fromObj(row));
            this.eventService.joinSizeTypeTransactionsByEventId(id, (err, rows2) => {
                if (err) return next(err);
                var sizeTypes: SizeType[] = rows2.map(row => SizeTypeFactory.fromObj(row));
                this.eventService.joinProductTransactionsByEventId(id, (err, rows3)=>{
                    if (err) return next(err);
                    var products = rows3.map(row => ProductFactory.fromObj(row));
                    this.categoryService.joinProducts((err, rows4) => {
                        if (err) return next(err);
                        var categories: Category[] = rows4.map(row => CategoryFactory.fromObj(row));
                        this.unitService.joinProducts((err, rows5) => {
                            if (err) return next(err);
                            var units: Unit[] = rows5.map(row => UnitFactory.fromObj(row));

                            products = products.map(p => {
                                p.category = categories.find(f => f.id === p.category.id);
                                return p;
                            }).map(p => {
                                p.unit = units.find(f => f.id === p.unit.id);
                                return p;
                            });

                            transactions = transactions.map(t => {
                                t.sizeType = sizeTypes.find(f => f.id === t.sizeType.id);
                                return t;
                            }).map(i => {
                                i.product = products.find(f => f.id === i.product.id);
                                return i;
                            });

                            res.send(transactions, { 'Content-Type': 'application/json; charset=utf-8' });
                        });
                    });
                });
            });
        });
    };
}