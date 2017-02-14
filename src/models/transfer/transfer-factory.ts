import { Validator } from '../../modules/validator';
import { Transfer } from './transfer';
import { EventFactory } from '../event/event-factory';
import { ProductFactory } from '../product/product-factory';
import { SizeTypeFactory } from '../sizetype/sizetype-factory';

export class TransferFactory {

    static empty(): Transfer {
        return new Transfer(0, EventFactory.empty(), ProductFactory.empty(), SizeTypeFactory.empty(), 0, new Date());
    }

    static fromJson(json: any): Transfer {

        let transfer = TransferFactory.empty();

        if (Validator.validNumber(json.transferId)) {
            transfer.id = json.transferId;
        }

        if (Validator.validNumber(json.change)) {
            transfer.change = json.change;
        }

        if (json.timestamp) {
            if(Validator.validDate(json.timestamp)) {
                transfer.timestamp = json.timestamp;
            } else {
                transfer.timestamp = new Date(json.timestamp);
            }
        }

        return transfer;
    }
  
}
