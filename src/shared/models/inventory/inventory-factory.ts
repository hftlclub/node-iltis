import { ValueChecker } from '../../valuechecker';
import { Inventory } from './inventory';
import { EventFactory } from '../event';
import { ProductFactory } from '../product';
import { SizeTypeFactory } from '../sizetype';

export class InventoryFactory {

    static empty(): Inventory {
        return new Inventory(ProductFactory.empty(), SizeTypeFactory.empty(), 0, 0, 0);
    }

    static fromObj(obj: any): Inventory {
        let inventory = InventoryFactory.empty();

        if (obj.product) inventory.product = ProductFactory.fromObj(obj.product);
        else if (ValueChecker.validNumber(obj.productId)) {
            inventory.product = ProductFactory.fromObj(obj);
        }

        if (obj.sizeType) inventory.sizeType = SizeTypeFactory.fromObj(obj.sizeType);
        else if (ValueChecker.validNumber(obj.sizeTypeId)) {
            inventory.sizeType = SizeTypeFactory.fromObj(obj);
        }

        if (ValueChecker.validNumber(obj.storage)) {
            inventory.storage = obj.storage;
        }

        if (ValueChecker.validNumber(obj.counter)) {
            inventory.counter = obj.counter;
        }

        if (ValueChecker.validNumber(obj.sizeMinimumStock)) {
            inventory.minStock = obj.sizeMinimumStock;
        }

        if (ValueChecker.validNumber(obj.minStock)) {
            inventory.minStock = obj.minStock;
        }

        return inventory;
    }
}
