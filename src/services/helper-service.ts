import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

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
        let query = `SELECT * FROM info WHERE infoKey = 'resettable'`;
        mysql.conn.query(query, (err, rows, fields) => {
            if (err) return callback(false);
            if (!rows.length) return callback(true);
            if (rows[0].infoValue == 'true') return callback(true);
            return callback(false);
        });
    }

    static initDB(samples: string, callback: (success: boolean) => void) {
        let createFile = path.resolve('database', 'create_tables.sql');
        fs.exists(createFile, (exists: boolean) => {
            if (exists) {
                fs.readFile(createFile, (err, data) => {
                    if (err) {
                        console.log(err);
                        return callback(false);
                    }
                    this.batchQuery(data.toString().split(';'), (success: boolean) => {
                        if (!success) return callback(false);
                        if (samples.length) {
                            let insertFile = path.resolve('database', path.parse(samples).name + '.sql');
                            fs.exists(insertFile, (exists: boolean) => {
                                if (exists) {
                                    fs.readFile(insertFile, (err, data) => {
                                        if (err) {
                                            console.log(err);
                                            return callback(false);
                                        }
                                        this.batchQuery(data.toString().split(';'), (success: boolean) => {
                                            if (!success) return callback(false);
                                            return callback(true);
                                        });
                                    });
                                } else return callback(false);
                            });
                        } else return callback(true);
                    });
                });
            } else callback(false);
        });
    }

    static resetDB(samples: string, callback: (success: boolean) => void) {
        let dropFile = path.resolve('database', 'drop_tables.sql');
        fs.exists(dropFile, (exists: boolean) => {
            if (exists) {
                fs.readFile(dropFile, (err, data) => {
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
            } else callback(false);
        });
    }

    private static batchQuery(queries: string[], callback: (success: boolean) => void) {
        if (queries.length && queries[0].replace(/(\r\n|\n|\r|\s)/gm, '').length > 0) {
            mysql.conn.query(queries[0], (err, rows, fields) => {
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
