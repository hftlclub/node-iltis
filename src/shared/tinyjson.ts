export class TinyJson {

    static getJSON(obj: any): string {
        return JSON.stringify(this.minimizeObj(obj), null, '  ');
    }

    private static minimizeObj(obj: any): any {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] == null) delete obj[key];
                else if (typeof obj[key] == 'string' && obj[key].length == 0) delete obj[key];
                else if (obj[key].length == 0) delete obj[key];
                else if (typeof obj[key] == 'object') {
                    obj[key] = this.minimizeObj(obj[key]);
                }
            }
        }
        return obj;
    }
}