import { Validator } from '../../modules/validator';
import { CrateType } from './cratetype';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class CrateTypeFactory {

    static empty(): CrateType {
        return new CrateType(0, SizeTypeFactory.empty(), 0);
    }

    static fromJson(json: any): CrateType {

        let crateType = CrateTypeFactory.empty();

        if (Validator.validNumber(json.crateTypeId)) {
            crateType.id = json.crateTypeId;
        }

        if (Validator.validNumber(json.refSize)) {
            crateType.sizeType.id = json.refSize;
        }

        if (Validator.validNumber(json.slots)) {
            crateType.slots = json.slots;
        }

        return crateType;
    }
  
}
