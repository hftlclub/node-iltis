import { Validator } from '../../modules/validator';
import { Transfer } from './transfer';
import { ProductFactory } from '../product/product-factory';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class TransferFactory {

    static empty(): Transfer {
        return new Transfer(0, ProductFactory.empty(), SizeTypeFactory.empty(), 0, null);
    }

    static fromObj(obj: any): Transfer {

        let transfer = TransferFactory.empty();

        if (Validator.validNumber(obj.transferId)) {
            transfer.id = obj.transferId;
        }

        if(obj.product) transfer.product = ProductFactory.fromObj(obj.product);
        else if (Validator.validNumber(obj.refProduct)) {
            transfer.product.id = obj.refProduct;
        }

        if(obj.sizeType) transfer.sizeType = SizeTypeFactory.fromObj(obj.sizeType);
        else if (Validator.validNumber(obj.refSize)) {
            transfer.sizeType.id = obj.refSize;
        }

        if (Validator.validNumber(obj.changeStorage)) {
            transfer.change = obj.changeStorage;
        }

        if (obj.timestamp) {
            if(Validator.validDate(obj.timestamp)) {
                transfer.timestamp = obj.timestamp;
            } else {
                transfer.timestamp = new Date(obj.timestamp);
            }
        }

        return transfer;
    }
  
}
