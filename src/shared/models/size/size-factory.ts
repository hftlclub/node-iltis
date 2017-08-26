import { SizeTypeFactory } from './../sizetype/sizetype-factory';
import { ValueChecker } from '../../valuechecker';
import { Size } from './size';

export class SizeFactory {

    static empty(): Size {
        return new Size(SizeTypeFactory.empty(), 0, 0, false);
    }

    static fromObj(obj: any): Size {

        let size = SizeFactory.empty();

        if (obj.sizeType) size.sizeType = SizeTypeFactory.fromObj(obj.sizeType);
        else if (ValueChecker.validNumber(obj.refSizeType)) {
            size.sizeType = SizeTypeFactory.fromObj(obj);
        }

        if (obj.minStock) size.minStock = obj.minStock;
        else if (ValueChecker.validNumber(obj.sizeMinimumStock)) {
            size.minStock = obj.sizeMinimumStock;
        }

        if (obj.costs) size.costs = obj.costs;
        else if (ValueChecker.validNumber(obj.sizeDeliveryCosts)) {
            size.costs = obj.sizeDeliveryCosts;
        }

        if (obj.active) size.active = obj.active;
        else size.active = !!ValueChecker.validBooleanNumber(obj.sizeActive);

        return size;
    }

}
