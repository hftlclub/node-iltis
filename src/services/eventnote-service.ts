let mysql = require('../modules/mysql');

export class EventNoteService {

    static getEventNoteHistory(eventId: number, callback: (err: any, rows?: any) => void) {
        let query = `SELECT *
                    FROM event_notes
                    WHERE refEvent = ?
                    ORDER BY eventNoteTS DESC`;
        mysql.conn.query(query, eventId, (err, rows, fields) => {
            if (err) {
                return callback(err);
            }
            if (!rows.length) {
                return callback(null, false);
            }
            return callback(null, rows);
        });
    };

    static addEventNote(eventNote: any, callback: (err: any, result?: any) => void) {
        let query = `INSERT INTO event_notes SET ?`;
        mysql.conn.query(query, eventNote, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    };
}
