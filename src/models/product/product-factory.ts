import { Validator } from '../../modules/validator';
import { Product } from './product';
import { CategoryFactory } from '../category/category-factory';
import { UnitFactory } from '../unit/unit-factory';
import { CrateTypeFactory } from '../cratetype/cratetype-factory';

export class ProductFactory {

    static empty(): Product {
        return new Product(0, CategoryFactory.empty(), UnitFactory.empty(), [], '', '', 0, '', true, false, new Date());
    }

    static fromObj(obj: any): Product {

        let product = ProductFactory.empty();

        if (Validator.validNumber(obj.productId)) {
            product.id = obj.productId;
        }

        if(obj.category) product.category = CategoryFactory.fromObj(obj.category);
        else if (Validator.validNumber(obj.refCategory)) {
            product.category.id = obj.refCategory;
        }

        if(obj.unit) product.unit = UnitFactory.fromObj(obj.unit);
        else if (Validator.validNumber(obj.refUnit)) {
            product.unit.id = obj.refUnit;
        }

        if(obj.crateTypes) product.crateTypes = obj.crateTypes.map(crateType => CrateTypeFactory.fromObj(crateType));

        if (Validator.validString(obj.name)) {
            product.name = obj.name.trim();
        }

        if (Validator.validString(obj.description)) {
            product.description = obj.description.trim();
        }

        if (Validator.validNumber(obj.priceIntern)) {
            product.priceIntern = obj.priceIntern;
        }

        if (Validator.validString(obj.imgFilename)) {
            product.imgFilename = obj.imgFilename.trim();
        }

        if (Validator.validNumber(obj.active)) {
            product.active = !!obj.active;
        }

        if (Validator.validNumber(obj.deleted)) {
            product.deleted = !!obj.deleted;
        }

        if (obj.timestamp) {
            if(Validator.validDate(obj.timestamp)) {
                product.timestamp = obj.timestamp;
            } else {
                product.timestamp = new Date(obj.timestamp);
            }
        }

        return product;
    }

}
