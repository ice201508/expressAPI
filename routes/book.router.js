var moment = require('moment');
var router = require('express').Router();
var db = require("../modal/mysql").db;

router.use(function(req, res, next){
    res.set({
        "Access-Control-Allow-Origin": "*", //指定某个具体的网站http://localhost:3000
        "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
    })
    next();
})

//http://expressjs.jser.us/guide.html#users-online
router.get('/allbooks', function(req, res, next){
    req.session.user = {
        name: 'Lucy',
        age: 25,
    }
    console.log("req.cookies: ", req.signedCookies);
    // console.log("req.session: ", req.session);
    var sql = 'select bid, bname, author, intro, price, img_url, detail, rate, create_time from book';
    db.query(sql, function(err, rows, fields){
        if(err) {
            res.status(500).send({code: -1, message: err})
        } else {
            res.status(200).send({
                code: 1,
                books: rows,
            })
            console.log('session user: ', req.session.user);
            console.log('session maxAge: ', req.session.cookie.maxAge);
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
