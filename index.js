var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var login = require('./routes/login.router');
var book = require('./routes/book.router');
var upload = require('./routes/upload.router');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use('/static', express.static(__dirname + '/public/'));

app.use(cookieParser());
//sesstion定义必须定义在路由分配之前
// app.use(session({
//     secret: 'session set',
//     name: 'book-seesion',  //默认名称是 connect.sid
//     resave: true,   //每次请求都重新计算过期时间(如果设置了固定的)
//     saveUninitialized: true,  //不管有没有设置session，true表示给每个请求带上即  res-header里面的set-cookies，用res.cookie(..)也在这个字段里面
//     cookie: {
//     maxAge : 3600000,
//     },
//     // store: new redisStore({
//     //     host: 'localhost',
//     //     port: 6379,
//     //     pass: 123456,
//     //     //prefix: 'book-session'  默认是sess:
//     // }),
// }))

//将对应的路由挂载到不同路径
app.use('/', login);
app.use('/book', book);
app.use('/upload', upload);

app.set("x-powered-by",false);
//默认所有请求都可以跨域
app.use(function(req, res, next){
    // res.set("Access-Control-Allow-Origin", "*");
    // res.set('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // res.set("Access-Control-Allow-Headers", "X-Requested-With");
    // res.set("Access-Control-Allow-Headers", "Content-Type");
    // res.header('Content-Type', 'application/json;charset=utf-8');
    // res.set("X-Powered-By",'leijiuling')
    
    
    next();
})

//错误处理中间件
app.use(function(err, req, res, next){
    if(req.session){
        next(new Error("没有设置session"));
    }
    console.log(err.stack);
    res.status(500).send('something broke');
})

app.listen(3005);
