var qiniu = require('qiniu');
var router = require('express').Router();
var db = require("../modal/mysql").db;

router.use(function(req, res, next){
    res.set({
        "Access-Control-Allow-Origin": "*", //指定某个具体的网站http://localhost:63342
        "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
    })
    next();
})


// 初始化ak,sk
qiniu.conf.ACCESS_KEY = 'LyLrgRgMtTtDksnpjVf8ru4Z4FpkkCFcN63aAa2t';
qiniu.conf.SECRET_KEY = 'gZVb9BmmezflcyYKdh1OmLkxAH8Jg6fkNl1ghUv_';
//存储空间名称
var bucket =  "bookshop"

router.get('/qiniu_token', function(req, res, next){
  token =  new qiniu.rs.PutPolicy(bucket);
  res.send({
    key: '',
    token: token.token(),
  })
})


module.exports = router;
