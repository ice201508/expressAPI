var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var db = require("../modal/modal").db;

router.use(function(req, res, next){
    next();
})

router.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname , '..' , '/views/index.html'));
})

router.get('/login', function(req, res, next){
    var mongo_data = null;
    if(!req.session.times){
        req.session.times = 1;
    } else {
        req.session.times += 1;
        db.collection('book').insert({times: req.session.times}, function(err, result){
            console.log(result);
            mongo_data = result;
            db.close();
        })
    }

    var data = {
        cookies: req.cookies || 'empty',
        session: req.session,
        path: path.resolve(__dirname , '..' , '/views/index.html'),
        times: ("调用接口的次数: " + req.session.times),
        mongo_data: mongo_data,
    }
    
    res.send(data);
})

module.exports = router;
