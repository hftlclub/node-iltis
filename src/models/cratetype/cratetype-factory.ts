import { Validator } from '../../modules/validator';
import { CrateType } from './cratetype';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class CrateTypeFactory {

    static empty(): CrateType {
        return new CrateType(0, SizeTypeFactory.empty(), 0);
    }

    static fromObj(obj: any): CrateType {

        let crateType = CrateTypeFactory.empty();

        if (Validator.validNumber(obj.crateTypeId)) {
            crateType.id = obj.crateTypeId;
        }

        if(obj.sizeType) crateType.sizeType = SizeTypeFactory.fromObj(obj.sizeType);
        else if (Validator.validNumber(obj.refSize)) {
            crateType.sizeType.id = obj.refSize;
        }

        if (Validator.validNumber(obj.slots)) {
            crateType.slots = obj.slots;
        }

        return crateType;
    }
  
}
