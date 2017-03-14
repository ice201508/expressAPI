exports.logError = function(err, req, res, next) {
    console.log(err.stack);
    next(err);
}

exports.clientError = function(err, req, res, next) {
    if(req.xhr){
        res.status(500).send({
            error: '服务器内部错误';
        })
    } else {
        next(err);
    }
}

exports.error = function(err, req, res, next) {
    res.status(406)
    res.send({'error': '通用错误处理'})
}
