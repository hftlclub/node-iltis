import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { EventType, EventTypeFactory } from '../shared/models/eventtype';
import { EventTypeService } from '../services/eventtype-service';


export class EventTypeController {

    getAll(req, res, next) {
        let eventTypes: EventType[] = [];
        EventTypeService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(eventTypes, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            eventTypes = rows.map(row => EventTypeFactory.fromObj(row));
            res.send(eventTypes, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getById(req, res, next) {
        let eventTypeId = parseInt(req.params.eventTypeId, 0);
        let eventType: EventType = EventTypeFactory.empty();
        EventTypeService.getById(eventTypeId, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                next(new NotFoundError('EventType does not exist'));
            }
            eventType = EventTypeFactory.fromObj(row);
            res.send(eventType, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}
