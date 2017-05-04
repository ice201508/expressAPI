## 环境
npm install express multer body-parser cookie-parser jsonwebtoken express-session mongoskin --save
使用supervisor调试


nodejs守护进程
node index.js > stdout.txt 2> stderr.txt < /dev/null &
disown

直接  nohup node index.js &

第三方，作为服务进程启动 forever start app.js

还可以用 [Systemd](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)

[Express文档](https://expressjs.com/)，
[Express中文文档](http://www.expressjs.com.cn/)
[Express Git BOOK](https://maninboat.gitbooks.io/n-blog/content/)

### 5种中间件

利用 Express 托管静态文件, express.static 唯一的一个内置中间件

app.use('/static', express.static('public'));  static这个是设置的一个虚拟目录，任意指定路径, 对应的在html引用资源时，在public目录下的资源下，加上static前缀，如<link rel="stylesheet" href="static/css/bootstrap.min.css">



### HTTP Header来发送元数据
API 在设置自定义 Header 的时候还要尽可能避免命名冲突， 之前的 X- 开头已经废弃了， 现在自定义的header可以加上特殊的前缀，如OpenStack-


### Cookie/Session
与请求有关的cookie分为request cookie和response cookie
request cookie是浏览器已储存的cookie
response cookie是服务器端返回的新的cookie，也就是将会储存在浏览器端的新cookie

设置cookie是通过在响应的头部加入 Set-Cookie 来设置的， response cookie 从服务器端返回新cookie

只有设置了app.use(cookieParser());  才能在请求中用 req.cookies, 即在服务器查看cookies
现在用了 app.use(session(options)), 也可以不用引入cookie-parser库， 直接用 req.session.name, 取得对应的已经储存的值


### 错误处理

### JWT
jsonwebtoken 中文  百度



### Mysql数据库
本机mysql服务启动  mysqld.exe,  关闭服务 mysqladmin -u root -p shutdown
之后就可以使用客户端连接了， mysql -u root -p
下载支持nodejs的mysql驱动  npm install mysql


### Mongodb数据库
[mongodb下载位置](http://dl.mongodb.org/dl/win32/x86_64)
mogond.exe 是数据库的进程               类似 mysqld
mongo.exe   是数据库的shell控制台    类似 mysql
让服务随window服务启动  mongod --dbpath D:\mongodb\db --logpath D:\mongodb\log\mongodb.log --logappend --directoryperdb --serviceName "MongoDB" --serviceDisplayName "MongoDB" --install
sc delete MongoDB
之后 net start/stop MongoDB  

mongo服务启动后，就可以通过mongo客户端操作数据库，
常见的mongo客户端：shell控制台，node,php等驱动程序，mongoVUE

使用[mongoskin](https://github.com/kissjs/node-mongoskin)驱动来接mongoDB
官方驱动[mongodb](http://mongodb.github.io/node-mongodb-native/)貌似不适合express

show dbs/collections
use book  //指定book数据库(没有就创建,默认是test)
db.createCollection("users");  //创建一个集合(就是表)
db.users.insert({userid: "admin", password: "123456"})  //插入一条数据
db.users.find()  查看数据


### Redis数据库
[redis Win64下载地址](https://github.com/ServiceStack/redis-windows/blob/master/downloads/redis-64.3.0.503.zip)

redis常用命令:
(keys *, keys 'lu*', randomkey, dbsize, info, flushdb清空)
set key value   ===>  get key
hset key field value   (对象存储)
hmset key field value [field value ...] 同时设置多个属性

redis-serever.exe 服务器， redis-cli.exe 客户端
修改配置文件   添加：requirepass 123456
执行redis-server d:\redis\redis.windows.conf --maxmemory 200M
客户端  redis-cli  启动   如果设置了密码，需要先执行auth 123456否则会提示错错误

redis针对node的客户端 node-redis
现在支持nodejs的redis驱动  npm install redis

[两者区别](http://www.open-open.com/lib/view/open1421307039328.html)

connect-redis是一个redis版的session存储器，使用node_redis作为驱动，配合express-session实现session存储到redis中


模仿别人的项目 https://github.com/nswbmw/N-blog/blob/master/lib/mongo.js


关于session的应用
npm install express-mysql-session --save

session 可以存放在 1）内存、2）cookie本身、3）redis 或 memcached 等缓存中，或者4）数据库中
线上来说，一般存在redis等缓存中

session存在服务器，只将session_id存放在客户端的cookie中
