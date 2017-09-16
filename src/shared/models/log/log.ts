import { Request } from 'restify';

export class Log {
    constructor(
        public id: number,
        public method: string,
        public path: string,
        public payload: string,
        public user: string,
        public timestamp: Date
    ) {}
  }
