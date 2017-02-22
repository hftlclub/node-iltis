import { Product } from '../product';
import { SizeType } from '../sizetype';

export class Inventory {
  constructor(
    public product: Product,
    public sizeType: SizeType,
    public storage: number,
    public counter: number
    ) {}
}
