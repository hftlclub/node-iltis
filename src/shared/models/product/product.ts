import { Category } from '../category';
import { Unit } from '../unit';
import { CrateType } from '../cratetype';
import { SizeType } from '../sizetype';
import { Size } from '../size';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public category: Category,
    public unit: Unit,
    public sizes: Size[],
    public crateTypes: CrateType[],
    public imgFilename: string,
    public active: boolean,
    public deleted: boolean,
    public timestamp: Date
    ) {}
}
