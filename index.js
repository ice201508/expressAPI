var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var login = require('./routes/login.router.js');
var book = require('./routes/book.router.js');

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use('/static', express.static(__dirname + '/public/'));

app.use('/', login);
app.use('/book', book);

app.listen(8000);
