import { Validator } from '../../modules/validator';
import { Event } from './event';
import { EventTypeFactory } from '../eventtype/eventtype-factory';

export class EventFactory {

    static empty(): Event {
        return new Event(0, EventTypeFactory.empty(), '', 0, 0, 0, new Date(), new Date(), true);
    }

    static fromObj(obj: any): Event {

        let event = EventFactory.empty();

        if (Validator.validNumber(obj.eventId)) {
            event.id = obj.eventId;
        }

        if(obj.eventType) event.eventType = EventTypeFactory.fromObj(obj.eventType);
        else if (Validator.validNumber(obj.refEventType)) {
            event.eventType.id = obj.refEventType;
        }

        if (Validator.validString(obj.description)) {
            event.description = obj.description.trim();
        }

        if (Validator.validNumber(obj.cashBefore)) {
            event.cashBefore = obj.cashBefore;
        }

        if (Validator.validNumber(obj.cashAfter)) {
            event.cashAfter = obj.cashAfter;
        }

        if (Validator.validNumber(obj.tip)) {
            event.tip = obj.tip;
        }

        if (obj.datetime) {
            if(Validator.validDate(obj.datetime)) {
                event.datetime = obj.datetime;
            } else {
                event.datetime = new Date(obj.datetime);
            }
        }

        if (obj.timestamp) {
            if(Validator.validDate(obj.timestamp)) {
                event.timestamp = obj.timestamp;
            } else {
                event.timestamp = new Date(obj.timestamp);
            }
        }

        if (Validator.validNumber(obj.active)) {
            event.active = !!obj.active;
        }

        return event;
    }
  
}
