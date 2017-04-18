var redis = require('redis');

var config = {
    host: '127.0.0.1',
    port: 6379,
    password: 123456,
}

db.on('error', function(err){
    console.log('err: ', err);
    return;
})

db.set('sessionID', 'aaf32radf324fgaf', redis.print);
db.hset("hash key", "hashtest 1", "some value", redis.print);
db.hset(["hash key", "hashtest 2", "some other value"], redis.print);
db.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    db.quit();
});
db.quit();

exports.db = redis.createClient(config);
