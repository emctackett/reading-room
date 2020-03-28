var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'us-cdbr-iron-east-01.cleardb.net',
  user            : 'b5b9bd7379cc31',
  password        : '22009cdd',
  database        : 'heroku_04f033e8b3507a2'
});
module.exports.pool = pool;
