import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Validator } from '../modules/validator';
import { Event } from '../models/event/event';
import { EventType } from '../models/eventtype/eventtype';
import { EventFactory } from '../models/event/event-factory';
import { EventService } from '../services/event-service';
import { EventTypeFactory } from '../models/eventtype/eventtype-factory';
import { EventTypeService } from '../services/eventtype-service';


export class EventController {
    private eventTypeService : EventTypeService;

    constructor(private eventService : EventService) {
        this.eventTypeService = new EventTypeService();
    }

    getAll(req, res, next) {
        let events : Event[] = [];
        this.eventService.getAll((err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(events, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            events = rows1.map(row => EventFactory.fromObj(row));
            this.eventTypeService.joinEvents((err, rows2) => {
                if (err) return next(err);
                var eventTypes : EventType[] = rows2.map(row => EventTypeFactory.fromObj(row));

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
        let event : Event = EventFactory.empty();
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
}