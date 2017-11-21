import { Unit } from '../unit';

export class SizeType {
  constructor(
    public id: number,
    public amount: number,
    public description: string,
    public unit: Unit,
    public deleted: boolean
    ) {}
}
