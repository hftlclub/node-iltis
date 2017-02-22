import { SizeType } from '../sizetype';

export class CrateType {
  constructor(
    public id: number,
    public sizeType: SizeType,
    public description: string,
    public slots: number,
    ) {}
}
