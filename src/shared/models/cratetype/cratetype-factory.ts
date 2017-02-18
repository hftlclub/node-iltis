import { ValueChecker } from '../../valuechecker';
import { CrateType } from './cratetype';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class CrateTypeFactory {

    static empty(): CrateType {
        return new CrateType(0, SizeTypeFactory.empty(),'', 0);
    }

    static fromObj(obj: any): CrateType {

        let crateType = CrateTypeFactory.empty();

        if (obj.id) crateType.id = obj.id;
        else if (ValueChecker.validNumber(obj.crateTypeId)) {
            crateType.id = obj.crateTypeId;
        }

        if(obj.sizeType) crateType.sizeType = SizeTypeFactory.fromObj(obj.sizeType);
        else if (ValueChecker.validNumber(obj.refSizeType)) {
            crateType.sizeType.id = obj.refSizeType;
        }

        if (obj.description) crateType.description = obj.description;
        else if (ValueChecker.validString(obj.crateTypeDesc)) {
            crateType.description = obj.crateTypeDesc.trim();
        }

        if (obj.slots) crateType.slots = obj.slots;
        else if (ValueChecker.validNumber(obj.crateTypeSlots)) {
            crateType.slots = obj.crateTypeSlots;
        }

        return crateType;
    }
  
}
