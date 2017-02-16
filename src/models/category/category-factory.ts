import { Validator } from '../../modules/validator';
import { Category } from './category';

export class CategoryFactory {

    static empty(): Category {
        return new Category(0, '', '', false);
    }

    static fromObj(obj: any): Category {

        let category = CategoryFactory.empty();

        if (Validator.validNumber(obj.categoryId)) {
            category.id = obj.categoryId;
        }

        if (Validator.validString(obj.name)) {
            category.name = obj.name.trim();
        }

        if (Validator.validString(obj.description)) {
            category.description = obj.description.trim();
        }

        category.deleted = !!Validator.validNumber(obj.deleted);

        return category;
    }
  
}
