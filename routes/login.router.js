var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sendMail = require('../core_methods/nodemailer').sendMail;
var public = require('../core_methods/public').public;
var moment = require('moment');

//var db = require("../modal/mongodb").db;
var db = require("../modal/mysql").db;

db.connect();

//CORS 跨域资源共享
router.use(function(req, res, next){
    res.set({
        // "Access-Control-Allow-Origin": "*", //指定某个具体的网站http://localhost:63342
        // "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        // "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
        //res.header('Access-Control-Allow-Headers', 'Content-Type');
        //res.header('Access-Control-Allow-Credentials','true');
    })
    next();
})

function create_table(){
    var sql_authcode = "CREATE TABLE IF NOT EXISTS `authcode` (`id` int(11) PRIMARY KEY not null auto_increment, `auth_code` varchar(10) NOT NULL COMMENT '验证码', `auth_code_confirm` varchar(50) NOT NULL COMMENT '验证码前端确认值',`create_time` datetime default now() COMMENT '创建时间')  default charset=utf8;";
    var sql_info = "CREATE TABLE IF NOT EXISTS `book` (`id` int(11) PRIMARY KEY not null auto_increment, `bid` varchar(20) NOT NULL, `bname` varchar(50) NOT NULL,`author` varchar(50) NOT NULL,`intro` varchar(100) NOT NULL,`price` varchar(30), `img_url` varchar(100) NOT NULL, `detail` varchar(1000), `rate` int(2), `create_time` datetime default now() COMMENT '创建时间', `update_time` datetime default now() COMMENT '最近更新时间')  default charset=utf8;";
    var sql_user = "CREATE TABLE IF NOT EXISTS `user` (`id` int(11) PRIMARY KEY not null auto_increment, `uid` varchar(20) NOT NULL, `email` varchar(50) NOT NULL, `password` varchar(50) NOT NULL,`uname` varchar(50),`sex` char(2) default 1, `phone` varchar(30), `create_time` datetime default now() NOT NULL COMMENT '创建时间', `update_time` datetime default now() DEFAULT NULL COMMENT '最近更新时间')  default charset=utf8;";
    var sql_order = "CREATE TABLE IF NOT EXISTS `order` (`id` int(11) PRIMARY KEY NOT NULL auto_increment,`order_id` varchar(20) NOT NULL, `member_id` varchar(20) DEFAULT NULL COMMENT '用户ID',`serial_no` varchar(20) DEFAULT NULL COMMENT '每日订单流水号',`pay_money` varchar(10) DEFAULT NULL COMMENT '待支付金额 、待退款金额 0表示支付完成', `create_time` datetime default now() NOT NULL COMMENT '下单时间')  default charset=utf8;";
    db.query(sql_authcode, function(err, rows, fields){
        if (err) throw err;
    });
    db.query(sql_info, function(err, rows, fields){
        if (err) throw err;
    });
    db.query(sql_user, function(err, rows, fields){
        if (err) throw err;
    });
    db.query(sql_order, function(err, rows, fields){
        if (err) throw err;
    });
}

//最好放在一个域名下，同一个服务不同网站放在不同目录下，共享一个服务进程index.js
router.get('/', function(req, res, next){
    res.cookie('isVisit', '3526464488', {signed: true, maxAge: 60*1000});
    res.cookie('user', 'Lucy');
    res.sendFile(path.join(__dirname , '../views/ng/index.html'));
})

router.get('/buy', function(req, res, next){
    res.sendFile(path.join(__dirname , '../views/vue/index.html'));
})

router.post('/login', function(req, res, next){    //post对应req.body
    if(req.body.auth_code_confirm) {
        var curr_time = moment().format("YYYY-MM-DD HH:mm");
        var uid = '00' + new Date().getTime();
        var sql = 'select auth_code from authcode where auth_code_confirm = ' + '"' + req.body.auth_code_confirm + '"';
        var sql_insert_user_info = 'insert into user VALUES(null,' + '"' + uid + '"'+ ",'" + req.body.email + "'," + "'" + req.body.password + "'," + 'null ,null,null,' + "'" + curr_time + "'," + "'"+curr_time + "'" + ')'
        db.query(sql, function(err, rows, fields){
            if(err){
                res.status(500).send({message: err})
            };
            console.log(rows);
            if(rows.length>0 && rows[0].auth_code == req.body.auth_code) {
                db.query(sql_insert_user_info, function(err, rows, fields){
                    if(err){
                        res.status(500).send({message: err})
                    };
                    res.send({
                        code: 1,
                        uid: uid,
                        email: rows[0].email,
                        message: '注册成功'
                    });
                })
            } else {
                res.status(400).send({message: '账号或密码或验证码输入错误！请重试'})
            }
        })
    } else {
        var pattern = /^\w+[\w-]*@[a-z0-9]+\.com|^root$/;
        var sql_select_user_info = 'select uid, email, password from user where email = ' + '"' + req.body.email + '"' + ' and password = ' + '"' + req.body.password +'"';
        if(req.body.email && req.body.password && pattern.test(req.body.email)){
            db.query(sql_select_user_info, function(err, rows, fields){
                if(err){
                    res.status(500).send({code: -1, message: err});
                } else {
                    if(rows.length > 0){
                        // if(req.session.userVisit) {
                        //     req.session.userVisit++;
                        // } else {
                        //     req.session.userVisit = 1;
                        // }
                        res.status(200).send({
                            code: 1,
                            uid: rows[0].uid,
                            email: rows[0].email,
                            message: '登录成功'
                        })
                    } else {
                        //不能用401, 不然就是错误请求，获取不到值了
                        res.status(200).send({
                            code: -1,
                            message: '账号或密码错误'
                        })
                    }
                }
            })
        } else {
            res.status(400).send({
                code: -1,
                message: '请求参数错误'
            })
        }
    }
})

router.post('/registry', function(req, res, next){
    create_table()
    res.status(200).send({
        code: 1,
        message: 'success'
    });
})

router.post('/authcode', function(req, res, next){
    console.log('req.query: ', req.query);
    var random_auth_code = '';
    var i = 0;
    while(i<4){
        random_auth_code += Math.floor(Math.random() * 10).toString()
        i++;
    }
    var curr_time = moment().format("YYYY-MM-DD HH:mm");
    var auth_code_confirm = public.generator_string(20);
    var sql = "insert into authcode VALUES(null," + random_auth_code + "," + "'" + auth_code_confirm + "'," + "'" +curr_time + "'" + ")";
console.log(sql);
    db.query(sql, function(err, rows, fields){
        if(err) throw err;
        console.log('插入数据库成功');
    })

    //var des = "'leko-ljl@163.com'";
    var des = req.query.email;
    var sub = "'主题内容'";
    var html = "'这是来自www.leijiuling.com的注册邮件，如果不是本人，请忽略<br /> <h3>验证码：" + random_auth_code + "</h3> <br/><a href='http://www.leijiuling.com'>前往</a>"

    var sendEmailRes = sendMail(des,sub,html);
    var data = {
        auth_code_confirm: auth_code_confirm,
        curr_time: curr_time,
    }
    res.send(data);
})

router.post('/upload', function(req, res, next){
    //var sql = "insert into book VALUES(null, 'es6入门', '阮一峰', '北京', '26.99',null,null), (null, 'js', '廖雪峰', '北京', '36.99',null,null)";
    var sql = 'select auth_code from authcode where auth_code_confirm = "17F4G3E0IH6HI932B824"';
    db.query(sql, function(err, rows, fields){
        if (err) throw err;
        var data = {
            rows: rows,
            field: fields,
        }
        res.send(data);
    })
})

router.get('/getinfo', function(req, res, next){
    console.log(req.cookies);
    res.set('staat', '123456');
    var sql = "select * from user";
    var des = "'leko-ljl@163.com'";
    var sub = "'主题内容'";
    var html = "这是来自www.leijiuling.com的注册邮件，如果不是本人，请忽略： <br /> <h3>验证码：4659</h3> <br/><a href='http://www.leijiuling.com'>前往</a>"
    //var responseEmail = sendMail(des,sub,html);
    db.query(sql, function(err, rows, field){
        if (err) throw err;
        var data = {
            rows: rows,
            fiele: field,
            cookies: req.cookies,
        }
        res.send(data);
    })
})


router.get('/edit', function(req,res,next){
    res.set('self-token', 'adfadfaw234');
    var data = {data: '123'};
    res.send(data);
})

module.exports = router;
