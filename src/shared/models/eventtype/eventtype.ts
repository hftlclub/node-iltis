export class EventType {
  constructor(
    public id: number,
    public description: string,
    public intern: boolean,
    public realEvent: boolean,
    public deleted: boolean
    ) {}
}