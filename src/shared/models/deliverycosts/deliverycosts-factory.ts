import { ValueChecker } from '../../valuechecker';
import { DeliveryCosts } from './deliverycosts';

export class DeliveryCostsFactory {

    static empty(): DeliveryCosts {
        return new DeliveryCosts(0, 0);
    }

    static fromObj(obj: any): DeliveryCosts {

        let deliveryCosts = DeliveryCostsFactory.empty();

        if (obj.sizeTypeId) deliveryCosts.sizeTypeId = obj.sizeTypeId;
        else if (ValueChecker.validNumber(obj.refSizeType)) {
            deliveryCosts.sizeTypeId = obj.refSizeType;
        }

        if (obj.costs) deliveryCosts.costs = obj.costs;
        else if (ValueChecker.validNumber(obj.additionDeliveryCosts)) {
            deliveryCosts.costs = obj.additionDeliveryCosts;
        }

        return deliveryCosts;
    }

}
