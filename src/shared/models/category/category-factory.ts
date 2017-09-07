import { ValueChecker } from '../../valuechecker';
import { Category } from './category';

export class CategoryFactory {

    static empty(): Category {
        return new Category(0, '', '', false);
    }

    static fromObj(obj: any): Category {

        let category = CategoryFactory.empty();

        if (obj.id) category.id = obj.id;
        else if (ValueChecker.validNumber(obj.categoryId)) {
            category.id = obj.categoryId;
        }

        if (obj.name) category.name = obj.name;
        else if (ValueChecker.validString(obj.categoryName)) {
            category.name = obj.categoryName.trim();
        }

        if (obj.description) category.description = obj.description;
        else if (ValueChecker.validString(obj.categoryDesc)) {
            category.description = obj.categoryDesc.trim();
        }

        if (obj.deleted) category.deleted = obj.deleted;
        else category.deleted = !!ValueChecker.validBooleanNumber(obj.categoryDeleted);

        if (obj.productCount) category.productCount = obj.productCount;
        else if (ValueChecker.validNumber(obj.productCount)) {
            category.productCount = obj.productCount;
        }

        return category;
    }

    static toDbObject(obj: Category): any {
        let dbEntry: any = {};

        if (obj.name) dbEntry.categoryName = obj.name;
        if (obj.description) dbEntry.categoryDesc = obj.description;

        dbEntry.categoryDeleted = false;

        return dbEntry;
    }

}
