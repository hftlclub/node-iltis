import { ValueChecker } from '../../valuechecker';
import { Product } from './product';
import { CategoryFactory } from '../category/category-factory';
import { UnitFactory } from '../unit/unit-factory';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';
import { CrateTypeFactory } from '../cratetype/cratetype-factory';

export class ProductFactory {

    static empty(): Product {
        return new Product(0, '', '', CategoryFactory.empty(), UnitFactory.empty(), [], [], 0, '', true, false, null);
    }

    static fromObj(obj: any): Product {

        let product = ProductFactory.empty();

        if (obj.id) product.id = obj.id;
        else if (ValueChecker.validNumber(obj.productId)) {
            product.id = obj.productId;
        }

        if (obj.name) product.name = obj.name;
        else if (ValueChecker.validString(obj.productName)) {
            product.name = obj.productName.trim();
        }

        if (obj.description) product.description = obj.description;
        else if (ValueChecker.validString(obj.productDesc)) {
            product.description = obj.productDesc.trim();
        }

        if(obj.category) product.category = CategoryFactory.fromObj(obj.category);
        else if (ValueChecker.validNumber(obj.refCategory)) {
            product.category.id = obj.refCategory;
        }

        if(obj.unit) product.unit = UnitFactory.fromObj(obj.unit);
        else if (ValueChecker.validNumber(obj.refUnit)) {
            product.unit.id = obj.refUnit;
        }

        if(obj.sizeTypes) product.sizeTypes = obj.sizeTypes.map(sizeTypes => CrateTypeFactory.fromObj(sizeTypes));

        if(obj.crateTypes) product.crateTypes = obj.crateTypes.map(crateType => CrateTypeFactory.fromObj(crateType));

        if (obj.priceIntern) product.priceIntern = obj.priceIntern;
        else if (ValueChecker.validNumber(obj.productPriceIntern)) {
            product.priceIntern = obj.productPriceIntern;
        }

        if (obj.imgFilename) product.imgFilename = obj.imgFilename;
        else if (ValueChecker.validString(obj.productImgFilename)) {
            product.imgFilename = obj.productImgFilename.trim();
        }

        if (obj.active) product.active = obj.active;
        else product.active = !!ValueChecker.validNumber(obj.productActive);

        if (obj.deleted) product.deleted = obj.deleted;
        else product.deleted = !!ValueChecker.validNumber(obj.productDeleted);

        if (obj.productTS) {
            if(ValueChecker.validDate(obj.productTS)) {
                product.timestamp = obj.productTS;
            }
        }

        return product;
    }

}
