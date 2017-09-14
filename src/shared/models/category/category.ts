export class Category {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public deleted: boolean,
    public productCount?: number
    ) {}
}
