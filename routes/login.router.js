var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//path.resolve(__dirname , '..' , '/views/index.html')

var app = express();
// app.use(cookieParser());
// app.use(session({
//   secret: '123465',
//   // name: 'testapp',
//   resave: true,
//   saveUninitialized: false,
//   cookie: {secure: true},
// }))

router.get('/', function(req, res, next){
  console.log('base path根路径： ', path.resolve(__dirname , '..' , '/views/index.html'));
  console.log('req.cookies:  ', req.cookie);
  console.log('req.session:  ', req.session);
  res.sendFile(path.join(__dirname , '..' , '/views/index.html'));
})

router.get('/login', function(req, res, next){
  console.log('req.cookies:  ', req.cookie);
  console.log('req.session:  ', req.session);
  var data = {
    cookies: req.cookies || 'null',
    session: req.session,
  }

  res.cookie('backend-cookies-set', 'def2017efea03112365asd', {maxAge: 60000, httpOnly: false});
  res.send(data);
})

module.exports = router;
