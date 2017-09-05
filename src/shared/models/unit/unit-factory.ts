import { ValueChecker } from '../../valuechecker';
import { Unit } from './unit';

export class UnitFactory {

    static empty(): Unit {
        return new Unit(0, '', '', false);
    }

    static fromObj(obj: any): Unit {

        let unit = UnitFactory.empty();

        if (obj.id) unit.id = obj.id;
        else if (ValueChecker.validNumber(obj.unitId)) {
            unit.id = obj.unitId;
        }

        if (obj.short) unit.short = obj.short;
        else if (ValueChecker.validString(obj.unitShort)) {
            unit.short = obj.unitShort.trim();
        }

        if (obj.full) unit.full = obj.full;
        else if (ValueChecker.validString(obj.unitFull)) {
            unit.full = obj.unitFull.trim();
        }

        if (obj.deleted) unit.deleted = obj.deleted;
        else unit.deleted = !!ValueChecker.validBooleanNumber(obj.unitDeleted);

        return unit;
    }

    static toDbObject(obj: Unit): any {
        let dbEntry: any = {};

        if (obj.short) dbEntry.unitShort = obj.short;
        if (obj.full) dbEntry.unitFull = obj.full;

        dbEntry.unitDeleted = false;

        return dbEntry;
    }

}
