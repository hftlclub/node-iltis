export class ValueChecker {

    static validNumber(no: number) {
        return typeof no == 'number';
    }

    static validBooleanNumber(no: number) {
        return no && typeof no == 'number';
    }


    static validString(str: string) {
        return str && typeof str == 'string';
    }

    static validDate(date: string) {
        return (new Date(date)).toString() !== 'Invalid Date';
    }

}