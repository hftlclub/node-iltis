import { ValueChecker } from '../../valuechecker';
import { MinimumStock } from './';

export class MinimumStockFactory {

    static empty(): MinimumStock {
        return new MinimumStock(0, 0, false);
    }

    static fromObj(obj: any): MinimumStock {

        let minimumStock = MinimumStockFactory.empty();

        if (obj.sizeTypeId) minimumStock.sizeTypeId = obj.sizeTypeId;
        else if (ValueChecker.validNumber(obj.refSizeType)) {
            minimumStock.sizeTypeId = obj.refSizeType;
        }

        if (obj.minStock) minimumStock.minStock = obj.minStock;
        else if (ValueChecker.validNumber(obj.additionMinimumStock)) {
            minimumStock.minStock = obj.additionMinimumStock;
        }

        if (obj.warningSend) minimumStock.warningSend = obj.warningSend;
        else minimumStock.warningSend = !!ValueChecker.validNumber(obj.additionWarningSend);

        return minimumStock;
    }

}
