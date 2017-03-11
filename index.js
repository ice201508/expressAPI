var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var login = require('./routes/login.router.js');
var book = require('./routes/book.router.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use('/static', express.static(__dirname + '/public/'));

app.use(cookieParser('cookieParser set'));
app.use(session({
  secret: 'session set',
  // name: 'testapp',
  resave: true,
  saveUninitialized: false,
  cookie: {},
}))

app.use('/', login);
app.use('/book', book);

app.listen(8000);
