import { Category } from '../category/category';
import { Unit } from '../unit/unit';
import { CrateType } from '../cratetype/cratetype';
import { SizeType } from '../sizetype/sizetype';
import { DeliveryCosts} from '../deliverycosts/deliverycosts';
import { MinimumStock } from '../minimumstock/minimumstock';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public category: Category,
    public unit: Unit,
    public sizeTypes: SizeType[],
    public crateTypes: CrateType[],
    public deliveryCosts: DeliveryCosts[],
    public minimumStocks: MinimumStock[],
    public imgFilename: string,
    public active: boolean,
    public deleted: boolean,
    public timestamp: Date
    ) {}
}