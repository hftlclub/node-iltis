import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Event } from '../shared/models/event/event';
import { Transfer } from '../shared/models/transfer/transfer';
import { TransferFactory } from '../shared/models/transfer/transfer-factory';
import { Transaction } from '../shared/models/transaction/transaction';
import { TransactionFactory } from '../shared/models/transaction/transaction-factory';
import { EventFactory } from '../shared/models/event/event-factory';
import { EventService } from '../services/event-service';

export class EventController {

    constructor(private eventService: EventService) {}

    getAll(req, res, next) {
        let events: Event[] = [];
        this.eventService.getAll((err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(events, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            events = rows1.map(row => EventFactory.fromObj(row));
            res.send(events, { 'Content-Type': 'application/json; charset=utf-8' });
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
            res.send(event, { 'Content-Type': 'application/json; charset=utf-8' });
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
            res.send(transfers, { 'Content-Type': 'application/json; charset=utf-8' });
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
            res.send(transactions, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}