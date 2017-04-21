var router = require('express').Router();
var moment = require('moment');
var db = require("../modal/mysql").db;

router.use(function(req, res, next){
    res.set({
        "Access-Control-Allow-Origin": "*", //指定某个具体的网站http://localhost:3000
        "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
    })
    next();
})

router.post('/get_all', function(req, res, next){
    console.log('req.body: ', req.body);
    var sql = "select uid, email, uname, sex, phone, create_time from user";
    db.query(sql, function(err, rows, fields){
        if (err) throw err;
        res.status(200).send({
            code: 1,
            users: rows,
        })
    })
})


module.exports = router
