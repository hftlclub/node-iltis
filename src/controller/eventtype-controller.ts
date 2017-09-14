import { NotFoundError, BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { EventType, EventTypeFactory } from '../shared/models/eventtype';
import { EventTypeService } from '../services/eventtype-service';


export class EventTypeController {

    // GET: Return all EventTypes
    getAll(req: Request, res: Response, next: Next) {
        EventTypeService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let eventTypes: EventType[] = rows.map(row => EventTypeFactory.fromObj(row));
            res.send(eventTypes, ContentType.ApplicationJSON);
        });
    };

    // GET: Return single EventType
    getById(req: Request, res: Response, next: Next) {
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
