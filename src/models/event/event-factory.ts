import { Validator } from '../../modules/validator';
import { Event } from './event';
import { EventTypeFactory } from '../eventtype/eventtype-factory';

export class EventFactory {

    static empty(): Event {
        return new Event(0, EventTypeFactory.empty(), '', 0, 0, 0, new Date(), new Date(), true);
    }

    static fromJson(json: any): Event {

        let event = EventFactory.empty();

        if (Validator.validNumber(json.eventId)) {
            event.id = json.eventId;
        }

        if (Validator.validString(json.description)) {
            event.description = json.description.trim();
        }

        if (Validator.validNumber(json.cashBefore)) {
            event.cashBefore = json.cashBefore;
        }

        if (Validator.validNumber(json.cashAfter)) {
            event.cashAfter = json.cashAfter;
        }

        if (Validator.validNumber(json.tip)) {
            event.tip = json.tip;
        }

        if (json.datetime) {
            if(Validator.validDate(json.datetime)) {
                event.datetime = json.datetime;
            } else {
                event.datetime = new Date(json.datetime);
            }
        }

        if (json.timestamp) {
            if(Validator.validDate(json.timestamp)) {
                event.timestamp = json.timestamp;
            } else {
                event.timestamp = new Date(json.timestamp);
            }
        }

        if (Validator.validNumber(json.active)) {
            event.active = !!json.active;
        }

        return event;
    }
  
}
