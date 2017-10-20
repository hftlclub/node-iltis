import * as fs from 'fs';

let mysql = require('../modules/mysql');

export class HelperService {

    static healthcheck(callback: (healthy: boolean) => void) {
        let query = `SELECT 1`;
        mysql.conn.query(query, (err, rows, fields) => {
            if (err) return callback(false);
            return callback(true);
        });
    }

    static checkInitDB(callback: (success: boolean) => void) {
        let query = `SELECT * FROM info`;
        mysql.conn.query(query, (err, rows, fields) => {
            if (err) return callback(true);
            return callback(false);
        });
    }

    static checkResetDB(callback: (success: boolean) => void) {
        let query = `SELECT * FROM info`;
        mysql.conn.query(query, (err, rows, fields) => {
            if (err) return callback(false);
            if (!rows.length) return callback(true);
            if (rows[0].devMode) return callback(true);
            return callback(false);
        });
    }

    static initDB(samples: boolean, callback: (success: boolean) => void) {
        fs.readFile('database/create_tables.sql', (err, data) => {
            if (err) {
                console.log(err);
                return callback(false);
            }
            this.batchQuery(data.toString().split(';'), (success: boolean) => {
                if (!success) return callback(false);
                if (samples) {
                    fs.readFile('database/fill_tables_samples.sql', (err, data) => {
                        if (err) {
                            console.log(err);
                            return callback(false);
                        }
                        this.batchQuery(data.toString().split(';'), (success: boolean) => {
                            if (!success) return callback(false);
                            return callback(true);
                        });
                    });
                } else return callback(true);
            });
        });
    }

    static resetDB(samples: boolean, callback: (success: boolean) => void) {
        fs.readFile('database/drop_tables.sql', (err, data) => {
            if (err) {
                console.log(err);
                return callback(false);
            }
            this.batchQuery(data.toString().split(';'), (success: boolean) => {
                if (!success) return callback(false);
                this.initDB(samples, (success: boolean) => {
                    if (!success) return callback(false);
                    return callback(true);
                });
            });
        });
    }

    private static batchQuery(queries: string[], callback: (success: boolean) => void) {
        if (queries.length && queries[0].replace(/(\r\n|\n|\r|\s)/gm, '').length > 0) {
            mysql.conn.query(queries[0], (err, rows, fields) => {
                console.log(queries[0] + ';');
                if (err) {
                    console.log(err);
                    return callback(false);
                }
                queries = queries.filter(item => queries.indexOf(item) !== 0);
                this.batchQuery(queries, (success: boolean) => {
                    if (err) {
                        console.log(err);
                        return callback(false);
                    }
                    return callback(true);
                });
            });
        } else return callback(true);
    }
}
