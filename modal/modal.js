var mongo = require('mongoskin');
var assert = require('assert');

var url = 'mongodb://localhost:27017/book';

exports.db = mongo.db(url);
