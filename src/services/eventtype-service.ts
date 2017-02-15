var mysql = require('../modules/mysql');

export class EventTypeService {

    getAll(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM event_types;';
        mysql.conn.query(query, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };

    getById(id: number, callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT * FROM event_types WHERE eventTypeId = ?;';
        mysql.conn.query(query, id, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows[0]) {
                return callback(null, false);
            }
            return callback(null, rows[0]);
        });
    };

    joinEvents(callback:(err:any, rows?:any)=>void) {
        var query = 'SELECT et.eventTypeId, et.description, et.intern, et.deleted FROM event_types et INNER JOIN events ON(eventTypeId = refEventType) GROUP BY eventTypeId;';
        mysql.conn.query(query, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };
}
