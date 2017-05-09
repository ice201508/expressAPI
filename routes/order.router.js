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

router.get('/all_orders', function(req, res, next){  //get方式没有req.body , 也不是req.params, 参数是req.query
    var sql = 'select order_id,pay_money,create_time from orders where member_id =' + '"' + req.query.user_id + '"';
    db.query(sql, function(err, rows, fields){
        if(err) {
            //一般状态不用500
            res.status(200).json({code: -1, message: err})
        } else {
            res.status(200).json({
                code: 1,
                orders: rows,
            })
        }
    })
})

router.post('/settle', function(req, res, next){
    var order_id = '00' + Date.now().toString();
    var serial_no = Date.now().toString();
    var curr_time = moment(req.body.create_time).format("YYYY-MM-DD HH:mm")
    //var sql=`insert into order VALUES (null, ${orderi_d}, ${req.body.user_id})`   怎样用es6字符串拼接
    var sql="insert into order_book VALUES(null," + "'" + order_id + "'," + "'" + req.body.user_id + "'," + "'" +serial_no + "',"  + "'" + req.body.total + "'," + "'" + moment().format("YYYY-MM-DD HH:mm") + "'" + ")"
    console.log('sql: ',sql);
    db.query(sql, function(err, rows, fields){
        if(err) {
            res.status(200).send({code: -1, message: '插入数据库失败'})
        } else {
            res.status(200).send({
                code: 1,
                message:'成功'
            });
        }
    })
})

module.exports = router;
