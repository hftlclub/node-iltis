import { SizeType } from '../sizetype/index';

export class Size {
  constructor(
    public sizeType: SizeType,
    public minStock: number,
    public costs: number,
    public active: boolean
    ) {}
}