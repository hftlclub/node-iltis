import { Validator } from '../../modules/validator';
import { Unit } from './unit';

export class UnitFactory {

    static empty(): Unit {
        return new Unit(0, '', '');
    }

    static fromObj(obj: any): Unit {

        let unit = UnitFactory.empty();

        if (Validator.validNumber(obj.unitId)) {
            unit.id = obj.unitId;
        }

        if (Validator.validString(obj.short)) {
            unit.short = obj.short.trim();
        }

        if (Validator.validString(obj.full)) {
            unit.full = obj.full.trim();
        }

        return unit;
    }
  
}
