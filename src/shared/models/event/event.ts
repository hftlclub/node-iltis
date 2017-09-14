import { EventNote } from './../eventnote/eventnote';
import { EventType } from '../eventtype';

export class Event {
  constructor(
    public id: number,
    public eventType: EventType,
    public description: string,
    public cashBefore: number,
    public cashAfter: number,
    public tip: number,
    public datetime: Date,
    public timestamp: Date,
    public active: boolean,
    public countedCounter: boolean,
    public countedStorage: boolean,
    public note?: EventNote,
    public noteHistoryCount?: number
    ) {}
}
