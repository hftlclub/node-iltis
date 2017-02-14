import { Validator } from '../../modules/validator';
import { EventType } from './eventtype';

export class EventTypeFactory {

    static empty(): EventType {
        return new EventType(0, '', false, false);
    }

    static fromJson(json: any): EventType {

        let eventtype = EventTypeFactory.empty();

        if (Validator.validNumber(json.eventTypeId)) {
            eventtype.id = json.eventTypeId;
        }

        if (Validator.validString(json.description)) {
            eventtype.description = json.description.trim();
        }

        if (Validator.validNumber(json.intern)) {
            eventtype.intern = !!json.intern;
        }

        if (Validator.validNumber(json.deleted)) {
            eventtype.deleted = !!json.deleted;
        }

        return eventtype;
    }
  
}
