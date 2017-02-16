import { Validator } from '../../modules/validator';
import { EventType } from './eventtype';

export class EventTypeFactory {

    static empty(): EventType {
        return new EventType(0, '', false, true, false);
    }

    static fromObj(obj: any): EventType {

        let eventtype = EventTypeFactory.empty();

        if (Validator.validNumber(obj.eventTypeId)) {
            eventtype.id = obj.eventTypeId;
        }

        if (Validator.validString(obj.description)) {
            eventtype.description = obj.description.trim();
        }

        eventtype.intern = !!Validator.validNumber(obj.intern);

        eventtype.realEvent = !!Validator.validNumber(obj.realEvent);

        eventtype.deleted = !!Validator.validNumber(obj.deleted);

        return eventtype;
    }
  
}
