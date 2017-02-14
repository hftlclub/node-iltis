import { Validator } from '../../modules/validator';
import { Inventory } from './inventory';
import { EventFactory } from '../event/event-factory';
import { ProductFactory } from '../product/product-factory';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class InventoryFactory {

    static empty(): Inventory {
        return new Inventory(EventFactory.empty(), ProductFactory.empty(), SizeTypeFactory.empty(), 0);
    }

    static fromJson(json: any): Inventory {

        let inventory = InventoryFactory.empty();

        if (Validator.validNumber(json.count)) {
            inventory.count = json.count;
        }

        return inventory;
    }
  
}
