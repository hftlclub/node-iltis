import { Event } from '../event/event';
import { Product } from '../product/product';
import { SizeType } from '../sizetype/sizetype';

export class Transfer {
  constructor(
    public id: number,
    public product: Product,
    public sizeType: SizeType,
    public change: number,
    public timestamp: Date
    ) {}
}