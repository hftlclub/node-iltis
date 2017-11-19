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

    static toDbObject(obj: Size, refProduct: number): any {
        let dbEntry: any = {};

        dbEntry.refProduct = refProduct;

        if (obj.sizeType) dbEntry.refSizeType = obj.sizeType.id;
        if (ValueChecker.validNumber(obj.costs)) dbEntry.sizeDeliveryCosts = obj.costs < 0 ? 0 : obj.costs;
        if (ValueChecker.validNumber(obj.minStock)) dbEntry.sizeMinimumStock = obj.minStock < 0 ? 0 : obj.minStock;
        if (obj.active) dbEntry.sizeActive = obj.active;
        else dbEntry.sizeActive = false;

        return dbEntry;
    }

}
