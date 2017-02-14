import { Event } from '../event/event';
import { Product } from '../product/product';
import { SizeType } from '../sizetype/sizetype';

export class Transfer {
  constructor(
    public id : number,
    public event : Event,
    public product : Product,
    public sizeTyoe : SizeType,
    public change : number,
    public timestamp : Date
    ) {}
}