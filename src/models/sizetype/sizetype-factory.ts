import { Validator } from '../../modules/validator';
import { SizeType } from '../sizetype/sizetype';

export class SizeTypeFactory {

    static empty(): SizeType {
        return new SizeType(0, 0, '', false);
    }

    static fromJson(json: any): SizeType {

        let sizeType = SizeTypeFactory.empty();

        if (Validator.validNumber(json.sizeTypeId)) {
            sizeType.id = json.sizeTypeId;
        }

        if (Validator.validNumber(json.amount)) {
            sizeType.amount = json.amount;
        }

        if (Validator.validString(json.description)) {
            sizeType.description = json.description.trim();
        }

        if (Validator.validNumber(json.deleted)) {
            sizeType.deleted = !!json.deleted;
        }

        return sizeType;
    }
  
}
