import { ValueChecker } from '../../valuechecker';
import { Product } from './product';
import { CategoryFactory } from '../category';
import { UnitFactory } from '../unit';
import { SizeTypeFactory } from '../sizetype';
import { CrateTypeFactory } from '../cratetype';
import { DeliveryCostsFactory } from '../deliverycosts';
import { MinimumStockFactory } from '../minimumstock';


export class ProductFactory {

    static empty(): Product {
        return new Product(0, '', '', CategoryFactory.empty(), UnitFactory.empty(), [], [], [], [], '', true, false, null);
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
        else if (ValueChecker.validNumber(obj.refCategory)) {
            product.category = CategoryFactory.fromObj(obj);
        }

        if (obj.unit) product.unit = UnitFactory.fromObj(obj.unit);
        else if (ValueChecker.validNumber(obj.refUnit)) {
            product.unit = UnitFactory.fromObj(obj);
        }

        if (obj.sizeTypes) product.sizeTypes = obj.sizeTypes.map(sizeTypes => SizeTypeFactory.fromObj(sizeTypes));

        if (obj.crateTypes) product.crateTypes = obj.crateTypes.map(crateType => CrateTypeFactory.fromObj(crateType));

        if (obj.deliveryCosts) product.deliveryCosts = obj.deliveryCosts.map(deliveryCosts => DeliveryCostsFactory.fromObj(deliveryCosts));

        if (obj.minimumStocks) product.minimumStocks = obj.minimumStocks.map(minimumStock => MinimumStockFactory.fromObj(minimumStock));

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

}
