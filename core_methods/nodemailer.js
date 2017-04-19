//https://nodemailer.com/about/
//nodemailer相当于客户端
var nodemailer = require('nodemailer');

//配置邮件
var transporter = nodemailer.createTransport({
  host:'smtp.qq.com',
  secure: true,
  port: 465,
  auth: {
    user: '414612218@qq.com',
    pass: 'getvuifjmtvfbgfh'
  }
});

//发送邮件
var sendMail = function(des,sub,html){
  var option = {
    from: '414612218@qq.com',
    to: des,
    subject: sub,
    html: html,
  }
  transporter.sendMail(option, function(error, response){
    if(error){
      console.error('fail: ' + error);
    } else {
      console.log('success: ' + response);
      return {data: response}
    }
  });
}

exports.sendMail = sendMail;
