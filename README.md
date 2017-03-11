## 环境
npm install express multer body-parser cookie-parser jsonwebtoken express-session --save
使用supervisor调试

[Express文档](https://expressjs.com/)，
[Express中文文档](http://www.expressjs.com.cn/)

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


### JWT
jsonwebtoken 中文  百度
