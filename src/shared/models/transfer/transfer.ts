import { Event } from '../event';
import { Product } from '../product';
import { SizeType } from '../sizetype';

export class Transfer {
  constructor(
    public id: number,
    public product: Product,
    public sizeType: SizeType,
    public change: number,
    public timestamp: Date
    ) {}
}
