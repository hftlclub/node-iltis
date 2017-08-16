import { ValueChecker } from '../../valuechecker';
import { Calculation } from './calculation';

export class CalculationFactory {

    static empty(): Calculation {
        return new Calculation(0, 0, 0);
    }

    static fromObj(obj: any): Calculation {

        let calculation = CalculationFactory.empty();

        if (ValueChecker.validNumber(obj.sales)) {
            calculation.sales = obj.sales;
        }

        if (ValueChecker.validNumber(obj.costs)) {
            calculation.costs = obj.costs;
        }

        if (ValueChecker.validNumber(obj.profit)) {
            calculation.profit = obj.profit;
        }

        return calculation;
    }

}
