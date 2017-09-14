import { ValueChecker } from '../../valuechecker';
import { EventNote } from './eventnote';

export class EventNoteFactory {

    static empty(): EventNote {
        return new EventNote(0, null, new Date(), null);
    }

    static fromObj(obj: any): EventNote {

        let eventNote = EventNoteFactory.empty();

        if (obj.id) eventNote.id = obj.id;
        else if (ValueChecker.validNumber(obj.eventNoteId)) {
            eventNote.id = obj.eventNoteId;
        }

        if (obj.text) eventNote.text = obj.text;
        else if (ValueChecker.validString(obj.eventNoteText)) {
            eventNote.text = obj.eventNoteText.trim();
        }

        if (obj.timestamp) eventNote.timestamp = new Date(obj.timestamp);
        else if (ValueChecker.validDate(obj.eventNoteTS)) {
            eventNote.timestamp = obj.eventNoteTS;
        }

        if (obj.user) eventNote.user = obj.user;
        else if (ValueChecker.validString(obj.eventNoteUser)) {
            eventNote.user = obj.eventNoteUser.trim();
        }

        return eventNote;
    }

    static toDbObject(obj: EventNote, refEvent: number, username?: string): any {
        let dbEntry: any = {};

        dbEntry.refEvent = refEvent;

        if (obj.text) dbEntry.eventNoteText = obj.text;
        if (username) dbEntry.eventNoteUser = username;

        return dbEntry;
    }
}
