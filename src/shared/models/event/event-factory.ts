import { ValueChecker } from '../../valuechecker';
import { Event } from './';
import { EventTypeFactory } from '../eventtype';

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

        if (obj.eventType) event.eventType = EventTypeFactory.fromObj(obj.eventType);
        else if (ValueChecker.validNumber(obj.refEventType)) {
            event.eventType = EventTypeFactory.fromObj(obj);
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

        if (obj.datetime) event.datetime = new Date (obj.datetime);
        else if (ValueChecker.validDate(obj.eventDT)) {
            event.datetime = obj.eventDT;
        }


        if (obj.timestamp) event.timestamp = new Date(obj.timestamp);
        else if (ValueChecker.validDate(obj.eventTS)) {
            event.timestamp = obj.eventTS;
        }

        if (obj.active) event.active = obj.active;
        else event.active = !!ValueChecker.validNumber(obj.eventActive);

        return event;
    }

    static fromModel(obj: Event): any {

        let  dbEntry: any = {};

        if (obj.eventType) dbEntry.refEventType = obj.eventType.id;

        if (obj.description) dbEntry.eventDesc = obj.description;

        if (ValueChecker.validNumber(obj.cashBefore)) dbEntry.eventCashBefore = obj.cashBefore;

        if (ValueChecker.validNumber(obj.cashAfter)) dbEntry.eventCashAfter = obj.cashAfter;

        if (obj.tip) dbEntry.eventTip = obj.tip;

        if (obj.datetime) dbEntry.eventDT = obj.datetime;

        if (obj.active) dbEntry.eventActive = true;
        else dbEntry.eventActive = false;

        return dbEntry;
    }

}
