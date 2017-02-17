import { Product } from '../product/product';
import { SizeType } from '../sizetype/sizetype';

export class Transaction {
  constructor(
    public id: number,
    public product: Product,
    public sizeTyoe: SizeType,
    public changeTotal: number,
    public changeCounter: number,
    public timestamp: Date
    ) {}
}