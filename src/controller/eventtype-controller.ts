import { NotFoundError, BadRequestError, ConflictError, InternalError } from 'restify';

import { ContentType } from '../contenttype';
import { EventType, EventTypeFactory } from '../shared/models/eventtype';
import { EventTypeService } from '../services/eventtype-service';


export class EventTypeController {

    getAll(req, res, next) {
        EventTypeService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send(204);
            let eventTypes: EventType[] = rows.map(row => EventTypeFactory.fromObj(row));
            res.send(eventTypes, ContentType.ApplicationJSON);
        });
    };

    getById(req, res, next) {
        let eventTypeId = parseInt(req.params.eventTypeId, 0);
        let eventType: EventType = EventTypeFactory.empty();
        EventTypeService.getById(eventTypeId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid eventTypeId'));
            if (!row) {
                next(new NotFoundError('EventType does not exist'));
            }
            eventType = EventTypeFactory.fromObj(row);
            res.send(eventType, ContentType.ApplicationJSON);
        });
    };
}
