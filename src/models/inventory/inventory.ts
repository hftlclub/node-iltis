import { Product } from '../product/product';
import { SizeType } from '../sizetype/sizetype';

export class Inventory {
  constructor(
    public product : Product,
    public sizeTyoe : SizeType,
    public storage : number,
    public counter : number
    ) {}
}