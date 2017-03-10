var router = require('express').Router();

router.use(function(req, res, next){
  console.log('book路由里的中间件,处理一些逻辑');
  next();
})

router.get('/list', function(req, res, next){
  var data = {
    'req_path': req.path,
    'req_originalUrl': req.originalUrl,
    'req_params': req.params,
  }
  res.send(data);
})

router.post('/detail', function(req, res, next){
  var data = {
    'req_path': req.path,
    'req_originalUrl': req.originalUrl,
    'req_params': req.params,
  }
  res.send(data);
})

module.exports = router;
