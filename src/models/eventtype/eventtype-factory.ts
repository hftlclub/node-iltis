import { Validator } from '../../modules/validator';
import { EventType } from './eventtype';

export class EventTypeFactory {

    static empty(): EventType {
        return new EventType(0, '', false, false);
    }

    static fromObj(obj: any): EventType {

        let eventtype = EventTypeFactory.empty();

        if (Validator.validNumber(obj.eventTypeId)) {
            eventtype.id = obj.eventTypeId;
        }

        if (Validator.validString(obj.description)) {
            eventtype.description = obj.description.trim();
        }

        if (Validator.validNumber(obj.intern)) {
            eventtype.intern = !!obj.intern;
        }

        if (Validator.validNumber(obj.deleted)) {
            eventtype.deleted = !!obj.deleted;
        }

        return eventtype;
    }
  
}
