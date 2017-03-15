
var accountSid = 'AC2f9abe85ad8dffdb2dd94f9e975ce8f9';
var authToken = 'f840a2eaaf3f7d1a1c6cf89b50610789';
var client = require('twilio')(accountSid, authToken);

function SendSMS() {
      console.log('phoneNumbers')
}


var SendSMS = function(phoneNumber,text,calllback){
    
     client.messages.create({
	to: PhoneNumber,
	from: '+14438254761',
	body: code,
        }, function (err, message) {
           if(err)
               {
                  console.log(err)
                   
               }
            calllback(err,message)
     });
}

var BuildSMSText = function(object,mapping,callback){
    
    var data =object.text_mail 
    
    mapping.forEach(function(key) {
        data = data + ':' +object.data[key]
        
    })
    
}

SendSMS.prototype.SMSNotify  = function(phoneNumbers,data,callback){
    
    console.log(phoneNumbers)
    
    if(phoneNumbers.length >0)        
        {
            var datas = object.data
            var text = object.text_mail
            console.log(phoneNumbers)
            console.log(data)
            phoneNumbers.forEach(function(number){
                datas.forEach(function(data){
                    
                    SendSMS(number,data,function(err,message)
                           {
                        callback(err,message)
                    })
                    
                })
            })
        }
}

module.exports = SendSMS;