export class EventNote {
  constructor(
    public id: number,
    public text: string,
    public timestamp: Date,
    public user: string
    ) {}
}
