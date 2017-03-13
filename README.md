## 环境
npm install express multer body-parser cookie-parser jsonwebtoken express-session mongoskin --save
使用supervisor调试

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


### JWT
jsonwebtoken 中文  百度


### Mongodb数据库
[mongodb下载位置](http://dl.mongodb.org/dl/win32/x86_64)
mogond.exe 是数据库的进程               类似 mysqld
mongo.exe   是数据库的shell控制台    类似 mysql
让服务随window服务启动  mongod --dbpath D:\mongodb\data --logpath D:\mongodb\log\mongodb.log --logappend --directoryperdb --serviceName "MongoDB" --serviceDisplayName "MongoDB" --install
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




