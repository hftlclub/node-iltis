import { ValueChecker } from '../../valuechecker';
import { SizeType } from './sizetype';

export class SizeTypeFactory {

    static empty(): SizeType {
        return new SizeType(0, 0, '', false);
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

        if (obj.deleted) sizeType.deleted = obj.deleted;
        else sizeType.deleted = !!ValueChecker.validBooleanNumber(obj.sizeTypeDeleted);

        return sizeType;
    }

}
