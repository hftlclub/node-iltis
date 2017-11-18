import { ValueChecker } from '../../valuechecker';
import { Product } from './product';
import { CategoryFactory } from '../category';
import { UnitFactory } from '../unit';
import { SizeTypeFactory } from '../sizetype';
import { CrateTypeFactory } from '../cratetype';
import { SizeFactory } from '../size';


export class ProductFactory {

    static empty(): Product {
        return new Product(0, '', '', CategoryFactory.empty(), UnitFactory.empty(), [], [], '', true, false, null);
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

        if (obj.category) product.category = CategoryFactory.fromObj(obj.category);
        else if (ValueChecker.validNumber(obj.refCategory) || ValueChecker.validNumber(obj.categoryId)) {
            product.category = CategoryFactory.fromObj(obj);
        }

        if (obj.unit) product.unit = UnitFactory.fromObj(obj.unit);
        else if (ValueChecker.validNumber(obj.refUnit) || ValueChecker.validNumber(obj.unitId)) {
            product.unit = UnitFactory.fromObj(obj);
        }

        if (obj.sizes) product.sizes = obj.sizes.map(size => SizeFactory.fromObj(size));

        if (obj.crateTypes) product.crateTypes = obj.crateTypes.map(crateType => CrateTypeFactory.fromObj(crateType));

        if (obj.imgFilename) product.imgFilename = obj.imgFilename;
        else if (ValueChecker.validString(obj.productImgFilename)) {
            product.imgFilename = obj.productImgFilename.trim();
        }

        if (obj.active) product.active = obj.active;
        else product.active = !!ValueChecker.validBooleanNumber(obj.productActive);

        if (obj.deleted) product.deleted = obj.deleted;
        else product.deleted = !!ValueChecker.validBooleanNumber(obj.productDeleted);


        if (obj.timestamp) product.timestamp = new Date (obj.timestamp);
        else if (ValueChecker.validDate(obj.productTS)) {
            product.timestamp = obj.productTS;
        }

        return product;
    }

    static toDbObject(obj: Product): any {
        let dbEntry: any = {};

        if (obj.category) dbEntry.refCategory = obj.category.id;
        if (obj.unit) dbEntry.refUnit = obj.unit.id;
        if (obj.name) dbEntry.productName = obj.name;
        if (obj.description) dbEntry.productDesc = obj.description;

        if (obj.active) dbEntry.productActive = obj.active;
        else dbEntry.productActive = false;

        if (obj.deleted) dbEntry.productDeleted = obj.deleted;
        else dbEntry.productDeleted = false;

        return dbEntry;
    }

}
