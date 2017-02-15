import { Category } from '../category/category';
import { Unit } from '../unit/unit';
import { CrateType } from '../cratetype/cratetype';

export class Product {
  constructor(
    public id : number,
    public category : Category,
    public unit : Unit,
    public crateTypes : CrateType[],
    public name : string,
    public description : string,
    public priceIntern : number,
    public imgFilename : string,
    public active : boolean,
    public deleted : boolean,
    public timestamp : Date
    ) {}
}