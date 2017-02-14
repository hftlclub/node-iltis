import { Validator } from '../../modules/validator';
import { Unit } from './unit';

export class UnitFactory {

    static empty(): Unit {
        return new Unit(0, '', '');
    }

    static fromJson(json: any): Unit {

        let unit = UnitFactory.empty();

        if (Validator.validNumber(json.unitId)) {
            unit.id = json.unitId;
        }

        if (Validator.validString(json.short)) {
            unit.short = json.short.trim();
        }

        if (Validator.validString(json.full)) {
            unit.full = json.full.trim();
        }

        return unit;
    }
  
}
