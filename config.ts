//application port
exports.port = 3000;

//absolute root path
exports.abspath = require('path').dirname(process.mainModule.filename);

//session secret (random string)
exports.tokensecret = require('crypto').randomBytes(20).toString('hex');

//path to image-files (product icons)
exports.imgpath = "";

//LDAP settings
exports.ldap = {
    "server": "10.12.114.138",
    "port": 389,
    "basedn": "dc=club,dc=hft-leipzig,dc=de",
    "userbase": "ou=users",
    "groupbase": "ou=groups",
    "admindn": "cn=admin,dc=club,dc=hft-leipzig,dc=de",
    "adminpw": ""
};

//MySQL settings
exports.dbcred = {
    "host": "srv3.malcher-server.de",
    "port": 3306,
    "user": "lagersystem",
    "password": "hZgF59CO9YmKJIlF4ST9tR",
    "database": "lagersystem"
}

//recipient for feedback emails
exports.feedbackmail = "mail@ferdinand-malcher.de, kontakt@robert-weisse.de.de";

//secret key for public (but protected) resources
exports.pubaccesskey = "abcdefg";

//settings for git webhook deployment
exports.deploykey = "hijklmnop";
