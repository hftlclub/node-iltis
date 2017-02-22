import { ValueChecker } from '../../valuechecker';
import { Transaction } from './';
import { ProductFactory } from '../product';
import { SizeTypeFactory } from '../sizetype';

export class TransactionFactory {

    static empty(): Transaction {
        return new Transaction(0, ProductFactory.empty(), SizeTypeFactory.empty(), 0, 0, null);
    }

    static fromObj(obj: any): Transaction {

        let transaction = TransactionFactory.empty();

        if (obj.id) transaction.id = obj.id;
        else if (ValueChecker.validNumber(obj.transactionId)) {
            transaction.id = obj.transactionId;
        }

        if (obj.product) transaction.product = ProductFactory.fromObj(obj.product);
        else if (ValueChecker.validNumber(obj.refProduct)) {
            transaction.product = ProductFactory.fromObj(obj);
        }

        if (obj.sizeType) transaction.sizeType = SizeTypeFactory.fromObj(obj.sizeType);
        else if (ValueChecker.validNumber(obj.refSizeType)) {
            transaction.sizeType = SizeTypeFactory.fromObj(obj);
        }

        if (obj.changeTotal) transaction.changeTotal = obj.changeTotal;
        else if (ValueChecker.validNumber(obj.transactionChangeTotal)) {
            transaction.changeTotal = obj.transactionChangeTotal;
        }

        if (obj.changeCounter) transaction.changeCounter = obj.changeCounter;
        else if (ValueChecker.validNumber(obj.transactionChangeCounter)) {
            transaction.changeCounter = obj.transactionChangeCounter;
        }

        if (obj.timestamp) transaction.timestamp = new Date (obj.timestamp);
        else if (ValueChecker.validDate(obj.transactionTS)) {
            transaction.timestamp = obj.transactionTS;
        }

        return transaction;
    }

}
