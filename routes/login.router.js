var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//var db = require("../modal/mongodb").db;
var db = require("../modal/mysql").db;
//var db = require("")

db.connect();

router.use(function(req, res, next){
    next();
})

router.get('/', function(req, res, next){
    var sql = "CREATE TABLE IF NOT EXISTS `info` (`bid` int PRIMARY KEY not null auto_increment,`bname` varchar(50) NOT NULL,`sex` char(2) NOT NULL,`addr` varchar(100) NOT NULL,`phone` varchar(30))  default charset=utf8;";
    console.log("sql: ", sql);
    db.query(sql, function(err, rows, field){
        res.sendFile(path.join(__dirname , '..' , '/views/index.html'));
    });
})

router.post('/upload', function(req, res, next){
    var sql = "insert into info VALUES(null, 'lucy', '女', '北京', '456789'), (null, 'Jack', '男', '上海', '987654')";
    db.query(sql, function(err, rows, field){
        if (err) throw err;
        var data = {
            rows: rows,
            fiele: field,
        }
        res.send(data);
    })
})

router.get('/getinfo', function(req, res, next){
    var sql = "select * from info";
    db.query(sql, function(err, rows, field){
        if (err) throw err;
        var data = {
            rows: rows,
            fiele: field,
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

module.exports = router;
