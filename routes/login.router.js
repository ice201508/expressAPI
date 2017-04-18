var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sendMail = require('../core_methods/nodemailer').sendMail;

//var db = require("../modal/mongodb").db;
var db = require("../modal/mysql").db;
//var db = require("")

db.connect();

router.use(function(req, res, next){
    next();
})

router.get('/', function(req, res, next){
    var sql_info = "CREATE TABLE IF NOT EXISTS `book` (`id` int(11) PRIMARY KEY not null auto_increment,`bname` varchar(50) NOT NULL,`author` varchar(50) NOT NULL,`addr` varchar(100) NOT NULL,`price` varchar(30), `create_time` datetime default now() COMMENT '创建时间', `update_time` datetime default now() COMMENT '最近更新时间')  default charset=utf8;";
    var sql_user = "CREATE TABLE IF NOT EXISTS `user` (`id` int(11) PRIMARY KEY not null auto_increment,`uname` varchar(50) NOT NULL,`sex` char(2) NOT NULL,`email` varchar(100) NOT NULL,`phone` varchar(30), `create_time` datetime default now() NOT NULL COMMENT '创建时间', `update_time` datetime default now() DEFAULT NULL COMMENT '最近更新时间')  default charset=utf8;";
    var sql_order = "CREATE TABLE IF NOT EXISTS `order` (`id` int(11) PRIMARY KEY not null auto_increment,`member_id` int(11) DEFAULT NULL COMMENT '用户ID',`serial_no` int(11) DEFAULT NULL COMMENT '每日订单流水号',`pay_money` float(11,2) DEFAULT NULL COMMENT '待支付金额 、待退款金额 0表示支付完成', `create_time` datetime default now() NOT NULL COMMENT '下单时间',`confirm_time` datetime default now() DEFAULT NULL COMMENT '订单确认时间')  default charset=utf8;";
    db.query(sql_info, function(err, rows, fields){
        if (err) throw err;
    });
    db.query(sql_user, function(err, rows, fields){
        if (err) throw err;
    });
    db.query(sql_order, function(err, rows, fields){
        if (err) throw err;
    });
    res.sendFile(path.join(__dirname , '..' , '/views/index.html'));
})

router.post('/upload', function(req, res, next){
    var sql = "insert into book VALUES(null, 'es6入门', '阮一峰', '北京', '26.99',null,null), (null, 'js', '廖雪峰', '北京', '36.99',null,null)";
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
    var sql = "select * from book";
    var des = "'leko-ljl@163.com'";
    var sub = "'主题内容'";
    var html = "这是来自www.leijiuling.com的注册邮件，如果不是本人，请忽略： <br /> <h3>验证码：4659</h3> <br/><a href='http://www.leijiuling.com'>前往</a>"
    var responseEmail = sendMail(des,sub,html);
    db.query(sql, function(err, rows, field){
        if (err) throw err;
        var data = {
            rows: rows,
            fiele: field,
            responseEmail: responseEmail,
        }
        res.send(data);
    })
})

router.get('/login', function(req, res, next){
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
    var data = {data: '123'};
    res.send('123');
})

module.exports = router;
