export class Validator {

    static validNumber(no: string) {
        return no && typeof no == 'number';
    }

    static validString(str: string) {
        return str && typeof str == 'string';
    }

    static validDate(date: string) {
        return (new Date(date)).toString() !== 'Invalid Date';
    }

}