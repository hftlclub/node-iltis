import { ValueChecker } from '../../valuechecker';
import { Event } from './event';
import { EventTypeFactory } from '../eventtype/eventtype-factory';

export class EventFactory {

    static empty(): Event {
        return new Event(0, EventTypeFactory.empty(), '', 0, 0, 0, new Date(), null, true);
    }

    static fromObj(obj: any): Event {

        let event = EventFactory.empty();

        if (obj.id) event.id = obj.id;
        else if (ValueChecker.validNumber(obj.eventId)) {
            event.id = obj.eventId;
        }

        if(obj.eventType) event.eventType = EventTypeFactory.fromObj(obj.eventType);
        else if (ValueChecker.validNumber(obj.refEventType)) {
            event.eventType = EventTypeFactory.fromObj(obj);;
        }

        if (obj.description) event.description = obj.description;
        else if (ValueChecker.validString(obj.eventDesc)) {
            event.description = obj.eventDesc.trim();
        }

        if (obj.cashBefore) event.cashBefore = obj.cashBefore;
        else if (ValueChecker.validNumber(obj.eventCashBefore)) {
            event.cashBefore = obj.eventCashBefore;
        }

        if (obj.cashAfter) event.cashAfter = obj.cashAfter;
        else if (ValueChecker.validNumber(obj.eventCashAfter)) {
            event.cashAfter = obj.eventCashAfter;
        }

        if (obj.tip) event.tip = obj.tip;
        else if (ValueChecker.validNumber(obj.eventTip)) {
            event.tip = obj.eventTip;
        }

        if (obj.eventDT) {
            if(ValueChecker.validDate(obj.eventDT)) {
                event.datetime = obj.eventDT;
            }
        }

        if (obj.eventTS) {
            if(ValueChecker.validDate(obj.eventTS)) {
                event.timestamp = obj.eventTS;
            }
        }

        if (obj.active) event.active = obj.active;
        else event.active = !!ValueChecker.validNumber(obj.eventActive);

        return event;
    }
  
}
