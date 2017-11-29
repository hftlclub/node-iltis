export class Log {
    constructor(
        public id: number,
        public code: number,
        public refId: number,
        public payload: string,
        public user: string,
        public timestamp: Date
    ) {}
  }
