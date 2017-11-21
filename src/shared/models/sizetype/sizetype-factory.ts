import { ValueChecker } from '../../valuechecker';
import { SizeType } from './sizetype';
import { UnitFactory } from '../unit';

export class SizeTypeFactory {

    static empty(): SizeType {
        return new SizeType(0, 0, '', UnitFactory.empty(), false);
    }

    static fromObj(obj: any): SizeType {

        let sizeType = SizeTypeFactory.empty();

        if (obj.id) sizeType.id = obj.id;
        else if (ValueChecker.validNumber(obj.sizeTypeId)) {
            sizeType.id = obj.sizeTypeId;
        }

        if (obj.amount) sizeType.amount = obj.amount;
        else if (ValueChecker.validNumber(obj.sizeTypeAmount)) {
            sizeType.amount = obj.sizeTypeAmount;
        }

        if (obj.description) sizeType.description = obj.description;
        else if (ValueChecker.validString(obj.sizeTypeDesc)) {
            sizeType.description = obj.sizeTypeDesc.trim();
        }

        if (obj.unit) sizeType.unit = UnitFactory.fromObj(obj.unit);
        else if (ValueChecker.validNumber(obj.refUnit) || ValueChecker.validNumber(obj.unitId)) {
            sizeType.unit = UnitFactory.fromObj(obj);
        }

        if (obj.deleted) sizeType.deleted = obj.deleted;
        else sizeType.deleted = !!ValueChecker.validBooleanNumber(obj.sizeTypeDeleted);

        return sizeType;
    }

    static toDbObject(obj: SizeType): any {
        let dbEntry: any = {};

        if (ValueChecker.validNumber(obj.amount)) dbEntry.sizeTypeAmount = obj.amount < 0 ? 0 : obj.amount;
        if (obj.description) dbEntry.sizeTypeDesc = obj.description;
        if (obj.unit) dbEntry.refUnit = obj.unit.id;

        dbEntry.sizeTypeDeleted = false;

        return dbEntry;
    }

}
