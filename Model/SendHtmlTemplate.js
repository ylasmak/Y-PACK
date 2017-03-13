var nodemailer = require('nodemailer')
var fs = require('fs');
var ejs = require('ejs');


function SendHtmlTemplate() {
    
}


var sendMail = function(toAddress, subject, content, next){
  var mailOptions = {
    from: "ylasmak@gmail.com",
    to: toAddress,
    replyTo: "noreplay@monitoring.com",
    subject: subject,
    html: content
  };

  smtpTransport.sendMail(mailOptions, next);
}; 




var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'ylasmak@gmail.com',
        pass: 'machallah'
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
       callback(err,response)
      
          
      });
    }
  });
};

module.exports = SendHtmlTemplate