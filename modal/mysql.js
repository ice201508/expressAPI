//https://www.npmjs.com/package/mysql 使用的 mysql相应客户端文档
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'book',
});

exports.db = connection;
