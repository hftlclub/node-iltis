import { Validator } from '../../modules/validator';
import { Category } from './category';

export class CategoryFactory {

    static empty(): Category {
        return new Category(0, '', '', false);
    }

    static fromJson(json: any): Category {

        let category = CategoryFactory.empty();

        if (Validator.validNumber(json.categoryId)) {
            category.id = json.categoryId;
        }

        if (Validator.validString(json.name)) {
            category.name = json.name.trim();
        }

        if (Validator.validString(json.description)) {
            category.description = json.description.trim();
        }

        if (Validator.validNumber(json.deleted)) {
            category.deleted = !!json.deleted;
        }

        return category;
    }
  
}
