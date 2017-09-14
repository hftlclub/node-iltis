import { EventNote, EventNoteFactory } from './../shared/models/eventnote';
import { EventNoteService } from './../services/eventnote-service';
import { NotFoundError, BadRequestError, InternalError, ForbiddenError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';



export class EventNoteController {

    getEventNoteHistory(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        EventNoteService.getEventNoteHistory(eventId, (err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let eventNotes: EventNote[] = rows.map(row => EventNoteFactory.fromObj(row));
            res.send(eventNotes, ContentType.ApplicationJSON);
        });
    };

    addEventNote(req: Request, res: Response, next: Next) {
        let eventId = parseInt(req.params.eventId, 0);
        EventNoteService.addEventNote(EventNoteFactory.toDbObject(req.body, eventId), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                res.send(201);
            }
        });
    };
}
