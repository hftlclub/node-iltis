import { Validator } from '../../modules/validator';
import { Inventory } from './inventory';
import { EventFactory } from '../event/event-factory';
import { ProductFactory } from '../product/product-factory';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class InventoryFactory {

    static empty(): Inventory {
        return new Inventory(ProductFactory.empty(), SizeTypeFactory.empty(), 0, 0);
    }

    static fromObj(obj: any): Inventory {

        let inventory = InventoryFactory.empty();

        if(obj.product) inventory.product = ProductFactory.fromObj(obj.product);
        else if (Validator.validNumber(obj.refProduct)) {
            inventory.product.id = obj.refProduct;
        }

        if(obj.sizeType) inventory.sizeTyoe = SizeTypeFactory.fromObj(obj.sizeType);
        else if (Validator.validNumber(obj.refSize)) {
            inventory.sizeTyoe.id = obj.refSize;
        }

        if (Validator.validNumber(obj.storage)) {
            inventory.storage = obj.storage;
        }

        if (Validator.validNumber(obj.counter)) {
            inventory.counter = obj.counter;
        }

        return inventory;
    }
  
}
