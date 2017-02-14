import { Validator } from '../../modules/validator';
import { Product } from './product';

export class ProductFactory {

    static empty(): Product {
        return new Product(0, 0, 0, '', '', 0, '', true, false, new Date());
    }

    static fromJson(json: any): Product {

        let product = ProductFactory.empty();

        if (Validator.validNumber(json.productId)) {
            product.id = json.productId;
        }

        if (Validator.validNumber(json.refCategory)) {
            product.refCategory = json.refCategory;
        }

        if (Validator.validNumber(json.refUnit)) {
            product.refUnit = json.refUnit;
        }

        if (Validator.validString(json.name)) {
            product.name = json.name.trim();
        }

        if (Validator.validString(json.description)) {
            product.description = json.description.trim();
        }

        if (Validator.validNumber(json.priceIntern)) {
            product.priceIntern = json.priceIntern;
        }

        if (Validator.validString(json.imgFilename)) {
            product.imgFilename = json.imgFilename.trim();
        }

        if (Validator.validNumber(json.active)) {
            product.active = !!json.active;
        }

        if (Validator.validNumber(json.deleted)) {
            product.deleted = !!json.deleted;
        }

        if (json.timestamp) {
            if(Validator.validDate(json.timestamp)) {
                product.timestamp = json.timestamp;
            } else {
                product.timestamp = new Date(json.timestamp);
            }
        }

        return product;
    }

}
