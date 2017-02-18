import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { EventType } from '../shared/models/eventtype/eventtype';
import { EventTypeFactory } from '../shared/models/eventtype/eventtype-factory';
import { EventTypeService } from '../services/eventtype-service';


export class EventTypeController {

    constructor(private eventTypeService: EventTypeService) { }

    getAll(req, res, next) {
        let eventTypes: EventType[] = [];
        this.eventTypeService.getAll((err, rows)=>{
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
        let id = parseInt(req.params.eventTypeId);
        let eventType: EventType = EventTypeFactory.empty();
        this.eventTypeService.getById(id, (err, row)=>{
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('EventType does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            eventType = EventTypeFactory.fromObj(row);
            res.send(eventType, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}