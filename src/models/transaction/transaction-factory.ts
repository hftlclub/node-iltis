import { Validator } from '../../modules/validator';
import { Transaction } from './transaction';
import { EventFactory } from '../event/event-factory';
import { ProductFactory } from '../product/product-factory';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class TransactionFactory {

    static empty(): Transaction {
        return new Transaction(0, EventFactory.empty(), ProductFactory.empty(), SizeTypeFactory.empty(), 0, 0, new Date());
    }

    static fromJson(json: any): Transaction {

        let transaction = TransactionFactory.empty();

        if (Validator.validNumber(json.transactionId)) {
            transaction.id = json.transactionId;
        }

        if (Validator.validNumber(json.changeTotal)) {
            transaction.changeTotal = json.changeTotal;
        }

        if (Validator.validNumber(json.changeCounter)) {
            transaction.changeCounter = json.changeCounter;
        }

        return transaction;
    }
  
}
