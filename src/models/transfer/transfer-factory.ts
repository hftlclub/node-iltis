import { Validator } from '../../modules/validator';
import { Transfer } from './transfer';
import { EventFactory } from '../event/event-factory';
import { ProductFactory } from '../product/product-factory';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class TransferFactory {

    static empty(): Transfer {
        return new Transfer(0, EventFactory.empty(), ProductFactory.empty(), SizeTypeFactory.empty(), 0, new Date());
    }

    static fromObj(obj: any): Transfer {

        let transfer = TransferFactory.empty();

        if (Validator.validNumber(obj.transferId)) {
            transfer.id = obj.transferId;
        }

        if(obj.event) transfer.event = EventFactory.fromObj(obj.event);
        else if (Validator.validNumber(obj.refEvent)) {
            transfer.event.id = obj.refEvent;
        }

        if(obj.product) transfer.product = ProductFactory.fromObj(obj.product);
        else if (Validator.validNumber(obj.refProduct)) {
            transfer.product.id = obj.refProduct;
        }

        if(obj.sizeType) transfer.sizeTyoe = SizeTypeFactory.fromObj(obj.sizeType);
        else if (Validator.validNumber(obj.refSize)) {
            transfer.sizeTyoe.id = obj.refSize;
        }

        if (Validator.validNumber(obj.change)) {
            transfer.change = obj.change;
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
