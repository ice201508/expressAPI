# expressAPI
express, rest api

## 环境
npm install express multer body-parser cookie-parser --save



###

利用 Express 托管静态文件, express.static 唯一的一个内置中间件

app.use('/static', express.static('public'));  static这个是设置的一个虚拟目录，任意指定路径, 对应的在html引用资源时，在public目录下的资源下，加上static前缀，如<link rel="stylesheet" href="static/css/bootstrap.min.css">
