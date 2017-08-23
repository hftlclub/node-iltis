const mysql = require('mysql');
const config = require('../../config');
const log = require('../modules/log');

export class MySQLConnection {
    static conn: any;

    static establishConnection() {
        MySQLConnection.conn = mysql.createConnection(config.dbcred);
        MySQLConnection.conn.connect(err => {
            if (err) {
                log.error('Error connecting to MySQL database:', err);
                setTimeout(() => MySQLConnection.establishConnection(), 2000);
            }
        });

        MySQLConnection.conn.on('error', err => {
            log.error('MySQL database error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                MySQLConnection.establishConnection();
            } else {
                throw err;
            }
        });
    }
}

MySQLConnection.establishConnection();
