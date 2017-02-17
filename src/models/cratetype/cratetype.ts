import { SizeType } from '../sizetype/sizetype';

export class CrateType {
  constructor(
    public id: number,
    public sizeType: SizeType,
    public slots: number,
    ) {}
}