var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'us-cdbr-iron-east-01.cleardb.net',
  user            : process.env.CLEARDB_KEY,
  password        : process.env.CLEARDB_SECRET,
  database        : process.env.CLEARDB_DB
});
module.exports.pool = pool;
