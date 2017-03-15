var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');

var fs = require('fs');
var ejs = require('ejs');


function SendHtmlTemplate() {
    
}

var sendMail = function(toAddress, subject, content, next){
      var mailOptions = {
        from: "no-replay@wafacash.com",
        to: toAddress,
        replyTo: "noreplay@monitoring.com",
        subject: subject,
        html: content
      };

  transporter.sendMail(mailOptions, next);
}; 




/* var transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail.wafacash.com',
    port: 25,
    auth: {
        user: 'login',
        pass: 'password'
    },
    secure:false,
    tls: {rejectUnauthorized: false},
    debug:true
}));*/

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'login@gmail.com',
        pass: 'password'
    }
});


SendHtmlTemplate.prototype.SendeMail = function(sendToList,title,data,callback){
  // res.render('index', { title: 'Express' });
  // specify jade template to load
  var template = process.cwd() + '/views/email.ejs';

  // get template from file system
  fs.readFile(template, 'utf8', function(err, file){
    if(err){
      //handle errors
      console.log(err);
    
    }
    else {       

      
        var compiled = ejs.compile(fs.readFileSync(template, 'utf8'));
       // console.log('data')
        //console.log(data)
        var html = compiled({ datas : data  });
        
 
      sendMail(sendToList, title, html, function(err, response){
      if(err)
          {
          console.log(err)
          }
          
          callback(err,response)
      
          
      });
    }
  });
};




module.exports = SendHtmlTemplate