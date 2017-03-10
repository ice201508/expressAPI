var router = require('express').Router();
var path = require('path');

//path.resolve(__dirname , '..' , '/views/index.html')
router.get('/', function(req, res, next){
  console.log(path.resolve(__dirname , '..' , '/views/index.html'));
  res.sendFile(path.join(__dirname , '..' , '/views/index.html'));
})

router.get('/login', function(req, res, next){
  var data = {
    user: 'Lucy',
    password: '123456',
  }
  res.send(data);
})

module.exports = router;
