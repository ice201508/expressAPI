var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var login = require('./routes/login.router');
var book = require('./routes/book.router');
var upload = require('./routes/upload.router');
var user = require('./routes/user.router');
var order = require('./routes/order.router');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
// app.use('/static', express.static(__dirname + '/views/static'));
app.use(express.static(__dirname + '/views/ng'));
app.use('/static', express.static(__dirname + '/views/vue/static'));    //每个应用可以有多个中间件，前面static的关键用处，且不能写/view/vue 必须是根目录
//app.engine('.html', ejs.__express)
//app.set('view engine', 'html')

app.use(cookieParser('self defined signed string anything'));   //签名的cookies
// app.use(cookieParser());
//app.set('trust proxy', 1)
//sesstion定义必须定义在路由分配之前
//这里的session是内存存储, 如果需要声明的周期长一点，如免密码2周等，这时可以使用内存之外的存储载体，数据库

app.use(session({
    secret: 'self defined signed string anything',  //签名的字符串，要和上面的cookieParser一致，不然req.signedCookies 里面的值就是false，不是sessionid
    name: 'book-session',  //默认名称是 connect.sid，传递给前端的cookie name值
    resave: true,   //每次请求都重新计算过期时间(如果设置了固定的)
    saveUninitialized: true,  //不管有没有设置session，true表示给每个请求带上即  res-header里面的set-cookies，用res.cookie(..)也在这个字段里面
    //rolling: true,  //每个请求都重新设置一个cookie，默认为false
    // cookie: {
    //     //maxAge : 3600000, //这个值不设置即 session cookie过期时间为浏览器关闭时间
    // },
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        //pass: 123456,
        //prefix: 'book-session:'  //默认是sess:
    }),
}))

/*
app.get('/', function(req, res, next){
    //if(req.session.isVisit) {
    if(true) {
        //req.session.isVisit++;
        console.log("req.session 2 ", req.session);
        console.log("req.signedCookies", req.signedCookies);
        res.sendFile(path.join(__dirname , './views/index.html'), {
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        });
        // res.send({
        //     isVisit: req.session.isVisit
        // });
    } else {
        let fileName = path.join(__dirname , './views/index.html');
        console.log('fileName: ',fileName);
        //req.session.isVisit = 1;
        //res.render(fileName)
        res.sendFile(fileName, {
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }, function(err){
            if(err){
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('Sent:', fileName);
            }
        });
        // res.send("欢迎第一次来这里");
        console.log("req.session 1 ", req.session);
    }
})
*/

//将对应的路由挂载到不同路径
app.use('/', login);
app.use('/book', book);
app.use('/upload', upload);
app.use('/user', user);
app.use('/order', order);

// app.set("x-powered-by",false);
//默认设置所有请求都可以跨域
app.use(function(req, res, next){
    res.set({
        "Access-Control-Allow-Origin": "http://www.leijiuling.com", //指定某个具体的网站http://localhost:63342, *表示所有网站
        "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
    })
    // res.set("Access-Control-Allow-Origin", "*");
    // res.set('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // res.set("Access-Control-Allow-Headers", "X-Requested-With");
    // res.set("Access-Control-Allow-Headers", "Content-Type");
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})

//错误处理中间件
app.use(function(err, req, res, next){
    // if(req.session){
    //     next(new Error("没有设置session"));
    // }
    console.log(err.stack);
    res.status(500).send({
        code: -1,
        message: '服务器出错'
    });
})

app.listen(3000);
