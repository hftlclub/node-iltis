export class Category {
  constructor(
    public id: number,
    public undefined | name: string,
    public description: string,
    public deleted: boolean,
    public productCount?: number
    ) {}
}
