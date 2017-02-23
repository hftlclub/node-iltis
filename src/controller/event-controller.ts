import { NotFoundError, BadRequestError, ConflictError, InternalError} from 'restify';

import { Event, EventFactory } from '../shared/models/event';
import { Transfer, TransferFactory } from '../shared/models/transfer';
import { Transaction, TransactionFactory } from '../shared/models/transaction';
import { CalculationFactory } from '../shared/models/calculation';
import { EventService } from '../services/event-service';


export class EventController {

    addEvent(req, res, next) {
        EventService.addEvent(EventFactory.fromModel(req.body), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                EventService.getById(result.insertId, (err, row) => {
                    if (err) return next(err);
                    res.send(201, EventFactory.fromObj(row), {'Content-Type': 'application/json; charset=utf-8'});
                });
            }
            else res.send(new InternalError());
        });
    };

    addTransferStorageOut(req, res, next) {
        let id = parseInt(req.context.eventId, 0);
        let transfers: any[] = [];
        req.body.forEach(obj => transfers.push(TransferFactory.fromModel(obj, id, true, -1)));
        this.addTransfer(req, res, next, transfers, id);
    };

    addTransferStorageIn(req, res, next) {
        let id = parseInt(req.context.eventId, 0);
        let transfers: any[] = [];
        req.body.forEach(obj => transfers.push(TransferFactory.fromModel(obj, id, true, 1)));
        this.addTransfer(req, res, next, transfers, id);
    };

    addTransferCounterOut(req, res, next) {
        let id = parseInt(req.context.eventId, 0);
        let transfers: any[] = [];
        req.body.forEach(obj => transfers.push(TransferFactory.fromModel(obj, id, false, -1)));
        this.addTransfer(req, res, next, transfers, id);
    };

    private addTransfer(req, res, next, transfers, eventId) {
        EventService.addTransfers(transfers, (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                EventService.getLastTransfers(eventId, result.insertId, (err, rows) => {
                    if (err) return next(err);
                    transfers = rows.map(row => TransferFactory.fromObj(row));
                    res.send(201, transfers, {'Content-Type': 'application/json; charset=utf-8'});
                });
            }
            else res.send(new InternalError());
        });
    };

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
