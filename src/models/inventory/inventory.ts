import { Event } from '../event/event';
import { Product } from '../product/product';
import { SizeType } from '../sizetype/sizetype';

export class Inventory {
  constructor(
    public event : Event,
    public product : Product,
    public sizeTyoe : SizeType,
    public count : number
    ) {}
}