//application port
exports.port = 3000;

//absolute root path
exports.abspath = require('path').dirname(process.mainModule.filename);

//MySQL settings
exports.dbcred = {
    "host": "example.com",
    "port": 3306,
    "user": "iltis",
    "password": "foobar",
    "database": "iltis"
};

exports.fileUploadUrl = 'https://cdn.hftl.club/files/upload';
exports.fileUploadSecret = 'foobar';