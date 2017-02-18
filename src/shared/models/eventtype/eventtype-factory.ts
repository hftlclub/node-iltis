import { ValueChecker } from '../../valuechecker';
import { EventType } from './eventtype';

export class EventTypeFactory {

    static empty(): EventType {
        return new EventType(0, '', false, true, false);
    }

    static fromObj(obj: any): EventType {

        let eventType = EventTypeFactory.empty();

        if (obj.id) eventType.id = obj.id;
        else if (ValueChecker.validNumber(obj.eventTypeId)) {
            eventType.id = obj.eventTypeId;
        }

        if (obj.description) eventType.description = obj.description;
        else if (ValueChecker.validString(obj.eventTypeDesc)) {
            eventType.description = obj.eventTypeDesc.trim();
        }

        if (obj.intern) eventType.intern = obj.intern;
        else eventType.intern = !!ValueChecker.validNumber(obj.eventTypeIntern);

        if (obj.realEvent) eventType.realEvent = obj.realEvent;
        else eventType.realEvent = !!ValueChecker.validNumber(obj.eventTypeRealEvent);

        if (obj.deleted) eventType.deleted = obj.deleted;
        else eventType.deleted = !!ValueChecker.validNumber(obj.eventTypeDeleted);

        return eventType;
    }
  
}
