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
        "Access-Control-Allow-Origin": "*", //指定某个具体的网站http://localhost:63342
        "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
        //res.header('Access-Control-Allow-Headers', 'Content-Type');
        //res.header('Access-Control-Allow-Credentials','true');
    })
    next();
})

function create_table(){
    var sql_authcode = "CREATE TABLE IF NOT EXISTS `authcode` (`id` int(11) PRIMARY KEY not null auto_increment, `auth_code` varchar(10) NOT NULL COMMENT '验证码', `auth_code_confirm` varchar(50) NOT NULL COMMENT '验证码前端确认值',`create_time` datetime default now() COMMENT '创建时间')  default charset=utf8;";
    var sql_info = "CREATE TABLE IF NOT EXISTS `book` (`id` int(11) PRIMARY KEY not null auto_increment, `bid` varchar(20) NOT NULL, `bname` varchar(50) NOT NULL,`author` varchar(50) NOT NULL,`intro` varchar(100) NOT NULL,`price` varchar(30), `img_url` varchar(100) NOT NULL, `detail` varchar(1000), `rate` int(2), `create_time` datetime default now() COMMENT '创建时间', `update_time` datetime default now() COMMENT '最近更新时间')  default charset=utf8;";
    var sql_user = "CREATE TABLE IF NOT EXISTS `user` (`id` int(11) PRIMARY KEY not null auto_increment, `uid` varchar(20) NOT NULL, `email` varchar(50) NOT NULL, `password` varchar(50) NOT NULL,`uname` varchar(50),`sex` char(2) default 1, `phone` varchar(30), `create_time` datetime default now() NOT NULL COMMENT '创建时间', `update_time` datetime default now() DEFAULT NULL COMMENT '最近更新时间')  default charset=utf8;";
    var sql_order = "CREATE TABLE IF NOT EXISTS `order` (`id` int(11) PRIMARY KEY NOT NULL auto_increment,`order_id` varchar(20) NOT NULL, `member_id` int(11) DEFAULT NULL COMMENT '用户ID',`serial_no` int(11) DEFAULT NULL COMMENT '每日订单流水号',`pay_money` float(11,2) DEFAULT NULL COMMENT '待支付金额 、待退款金额 0表示支付完成', `create_time` datetime default now() NOT NULL COMMENT '下单时间',`confirm_time` datetime default now() DEFAULT NULL COMMENT '订单确认时间')  default charset=utf8;";
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

router.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname , '..' , '/views/index.html'));
})

router.post('/login', function(req, res, next){
    console.log("req.body: ", req.body);
    if(req.body.auth_code_confirm) {
        var curr_time = moment().format();
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
                        message: '注册成功'
                    });
                })
            } else {
                res.status(400).send({message: '账号或密码或验证码输入错误！请重试'})
            }
        })
    } else {
        var sql_select_user_info = 'select email, password from user where email = ' + '"' + req.body.email + '"' + ' and password = ' + '"' + req.body.password +'"';
        db.query(sql_select_user_info, function(err, rows, fields){
            if(err) throw err;
            console.log('查询成功',rows);
            if(rows.length > 0){
                res.status(200).send({
                    code: 1,
                    message: '登录成功'
                })
            } else {
                res.status(200).send({
                    code: -1,
                    message: '账号或密码错误'
                })
            }
        })
    }
})

router.post('/registry', function(req, res, next){
    create_table()
    res.status(500).send({message: 'success'});
})

router.post('/authcode', function(req, res, next){
    var random_auth_code = '';
    var i = 0;
    while(i<4){
        random_auth_code += Math.floor(Math.random() * 10).toString()
        i++;
    }
    var curr_time = moment().format();
    var auth_code_confirm = public.generator_string(20);
    var sql = "insert into authcode VALUES(null," + random_auth_code + "," + "'" + auth_code_confirm + "'," + "'" +curr_time + "'" + ")";

    db.query(sql, function(err, rows, fields){
        if(err) throw err;
        console.log('插入数据库成功');
    })

    var des = "'leko-ljl@163.com'";
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

router.get('/login1111', function(req, res, next){
    if(!req.session.times){
        req.session.times = 1;
    } else {
        req.session.times += 1;
        // db.collection('book').insert({times: req.session.times}, function(err, result){
        //     console.log(result);
        //     mongo_data = result;
        //     db.close();
        // })
    }

    var data = {
        cookies: req.cookies || 'empty',
        session: req.session,
        path: path.resolve(__dirname , '..' , '/views/index.html'),
        times: ("调用接口的次数: " + req.session.times),
    }
    
    res.send(data);
})

router.get('/edit', function(req,res,next){
    res.set('self-token', 'adfadfaw234');
    var data = {data: '123'};
    res.send(data);
})

module.exports = router;
