var moment = require('moment');
var router = require('express').Router();
var db = require("../modal/mysql").db;

router.use(function(req, res, next){
    // res.set({
    //     "Access-Control-Allow-Origin": "*", //指定某个具体的网站http://localhost:3000
    //     "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
    //     "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
    // })
    next();
})

//http://expressjs.jser.us/guide.html#users-online
router.get('/allbooks', function(req, res, next){
    // if(req.session.isVisitSession) {
    //     req.session.isVisitSession++;
    // } else {
    //     req.session.isVisitSession = 1;
    // }
    console.log('res.session: ', req.session);
    console.log('req.header: ', req.headers.cookie);
    console.log("req.signedCookies: ", req.signedCookies);
    console.log("req.signedCookies[connect.sid]: ", req.signedCookies['book-session']);
    console.log("req.cookies: ", req.cookies);
    var sql = 'select bid, bname, author, intro, price, img_url, detail, rate, create_time from book';
    db.query(sql, function(err, rows, fields){
        if(err) {
            res.status(500).send({code: -1, message: err})
        } else {
            //cookie-parser的功能，通过http协议的set-Cookie设置前端的cookie
            //res.cookie('isVisit', true, {maxAge: 60*1000});
            res.status(200).send({
                code: 1,
                books: rows,
            })
        }
    })
})

router.get('/onebook/:id', function(req, res, next){
    var sql = 'select bid, bname, author, intro, price, img_url, detail, rate, create_time from book where bid =' +req.params.id;
    db.query(sql, function(err, rows, fields){
        if(err) {
            res.status(500).send({code: -1, message: err})
        } else {
            res.status(200).send({
                code: 1,
                book: rows,
            })
        }
    })
})

router.post('/edit', function(req, res, next){
    var bid = '00' + Date.now().toString();
    if(req.body){
        console.log('bid:  ',bid);
        var curr_time = moment().format("YYYY-MM-DD HH:mm:ss");
        var sql = "insert into book VALUES(null," + '"' + bid + '"' + ",'" + req.body.bname + "'," + "'" + req.body.author + "'," + "'" + req.body.intro + "'," + "'" + req.body.price + "',"  + "'" + req.body.imgUrl + "',"  + "'" + req.body.detail + "'," + "'" + req.body.rate + "'," + "'" + curr_time + "'," + "'" + curr_time + "'"  + ")";
        console.log('sql: ', sql);
        db.query(sql, function(err, rows, fields){
            if(err){
                res.status(500).send({message: '失败'});
            };
            res.status(200).send({message:'成功'});
        })
    } else {
            res.status(401).send({message: '参数错误'})
        }
    })


router.post('/detail', function(req, res, next){
    var data = {
        'req_path': req.path,
        'req_originalUrl': req.originalUrl,
        'req_params': req.params,
        'session': req.session,
    }
    res.send(data);
})

module.exports = router;
