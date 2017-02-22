import { ValueChecker } from '../../valuechecker';
import { Inventory } from './';
import { EventFactory } from '../event';
import { ProductFactory } from '../product';
import { SizeTypeFactory } from '../sizetype';

export class InventoryFactory {

    static empty(): Inventory {
        return new Inventory(ProductFactory.empty(), SizeTypeFactory.empty(), 0, 0);
    }

    static fromObj(obj: any): Inventory {

        let inventory = InventoryFactory.empty();

        if(obj.product) inventory.product = ProductFactory.fromObj(obj.product);
        else if (ValueChecker.validNumber(obj.refProduct)) {
            inventory.product = ProductFactory.fromObj(obj);
        }

        if(obj.sizeType) inventory.sizeType = SizeTypeFactory.fromObj(obj.sizeType);
        else if (ValueChecker.validNumber(obj.refSizeType)) {
            inventory.sizeType = SizeTypeFactory.fromObj(obj);
        }

        if (ValueChecker.validNumber(obj.storage)) {
            inventory.storage = obj.storage;
        }

        if (ValueChecker.validNumber(obj.counter)) {
            inventory.counter = obj.counter;
        }

        return inventory;
    }

}
