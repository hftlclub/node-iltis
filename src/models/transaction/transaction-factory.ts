import { Validator } from '../../modules/validator';
import { Transaction } from './transaction';
import { EventFactory } from '../event/event-factory';
import { ProductFactory } from '../product/product-factory';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class TransactionFactory {

    static empty(): Transaction {
        return new Transaction(0, EventFactory.empty(), ProductFactory.empty(), SizeTypeFactory.empty(), 0, 0, new Date());
    }

    static fromObj(obj: any): Transaction {

        let transaction = TransactionFactory.empty();

        if (Validator.validNumber(obj.transactionId)) {
            transaction.id = obj.transactionId;
        }

        if(obj.event) transaction.event = EventFactory.fromObj(obj.event);
        else if (Validator.validNumber(obj.refEvent)) {
            transaction.event.id = obj.refEvent;
        }

        if(obj.product) transaction.product = ProductFactory.fromObj(obj.product);
        else if (Validator.validNumber(obj.refProduct)) {
            transaction.product.id = obj.refProduct;
        }

        if(obj.sizeType) transaction.sizeTyoe = SizeTypeFactory.fromObj(obj.sizeType);
        else if (Validator.validNumber(obj.refSize)) {
            transaction.sizeTyoe.id = obj.refSize;
        }

        if (Validator.validNumber(obj.changeTotal)) {
            transaction.changeTotal = obj.changeTotal;
        }

        if (Validator.validNumber(obj.changeCounter)) {
            transaction.changeCounter = obj.changeCounter;
        }

        return transaction;
    }
  
}
