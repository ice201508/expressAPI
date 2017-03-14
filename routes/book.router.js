var router = require('express').Router();

router.use(function(req, res, next){
    console.log('book路由里的中间件,处理一些逻辑');
    if(req.session.times && req.session.times >= 1){
        next();
    } else {
        res.send("错误");
    }
    //next(new Error('lei'));
    next()
})

//http://expressjs.jser.us/guide.html#users-online
router.get('/list/:id', function(req, res, next){
    var data = {
        'req_path': req.path,
        'req_originalUrl': req.originalUrl,
        'req_params': req.params,
    res.send(data);
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
