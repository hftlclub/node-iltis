export class Product {
  constructor(
    public id : number,
    public refCategory : number,
    public refUnit : number,
    public name : string,
    public description : string,
    public priceIntern : number,
    public imgFilename : string,
    public active : boolean,
    public deleted : boolean,
    public timestamp : Date
    ) {}
}