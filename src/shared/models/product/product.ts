import { Category } from '../category';
import { Unit } from '../unit';
import { CrateType } from '../cratetype';
import { SizeType } from '../sizetype';
import { DeliveryCosts} from '../deliverycosts';
import { MinimumStock } from '../minimumstock';

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
