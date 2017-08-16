import { ValueChecker } from '../../valuechecker';
import { Transfer } from './transfer';
import { ProductFactory } from '../product';
import { SizeTypeFactory } from '../sizetype';
import { Inventory, InventoryFactory} from '../inventory';


export class TransferFactory {

    static empty(): Transfer {
        return new Transfer(0, ProductFactory.empty(), SizeTypeFactory.empty(), 0, null);
    }

    static fromObj(obj: any): Transfer {

        let transfer = TransferFactory.empty();

        if (obj.id) transfer.id = obj.id;
        else if (ValueChecker.validNumber(obj.transferId)) {
            transfer.id = obj.transferId;
        }

        if (obj.product) transfer.product = ProductFactory.fromObj(obj.product);
        else if (ValueChecker.validNumber(obj.refProduct)) {
            transfer.product = ProductFactory.fromObj(obj);
        }

        if (obj.sizeType) transfer.sizeType = SizeTypeFactory.fromObj(obj.sizeType);
        else if (ValueChecker.validNumber(obj.refSizeType)) {
            transfer.sizeType = SizeTypeFactory.fromObj(obj);
        }

        if (obj.change) transfer.change = obj.change;
        else if (ValueChecker.validNumber(obj.transferChangeStorage) && ValueChecker.validNumber(obj.transferChangeCounter)) {
            transfer.change = obj.transferChangeStorage + obj.transferChangeCounter;
        }

        if (obj.timestamp) transfer.timestamp = new Date (obj.timestamp);
        else if (ValueChecker.validDate(obj.transferTS)) {
            transfer.timestamp = obj.transferTS;
        }

        return transfer;
    }

    static toDbObject(obj: Transfer, eventId: number, isStorageChange: boolean, sign: number): any {

        let  dbEntry: any = {};

        dbEntry.refEvent = eventId;

        if (obj.product) dbEntry.refProduct = obj.product.id;

        if (obj.sizeType) dbEntry.refSizeType = obj.sizeType.id;

        if (isStorageChange) {
            dbEntry.transferChangeStorage = obj.change * sign;
            dbEntry.transferChangeCounter = 0;
        } else {
            dbEntry.transferChangeStorage = 0;
            dbEntry.transferChangeCounter = obj.change * sign;
        }

        return dbEntry;
    }
}
