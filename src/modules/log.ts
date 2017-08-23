import * as logger from 'simple-node-logger';

const log = logger.createSimpleLogger({
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

log.setLevel('debug');


module.exports = log;
