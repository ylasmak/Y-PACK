
function SendSMS() {
      console.log('phoneNumbers')
}


var SendTwilioSMS = function(PhoneNumber,text,calllback){
    
    var accountSid = 'AC2f9abe85ad8dffdb2dd94f9e975ce8f9';   
    var authToken = 'f840a2eaaf3f7d1a1c6cf89b50610789';
    var client = require('twilio')(accountSid, authToken);
    
   
    client.messages.create({
	to: PhoneNumber,
	from: '+14438254761',
	body: text,
        }, function (err, message) {
           if(err)
               {
                  console.log(err)
                   
               }
        
              
            calllback(err,message)
     });
}

var BuildSMSText = function(object,mapping,text,callback){
    
    var data =text +"\r\n " 
   
    
    mapping.forEach(function(key) {
        
        data = data + key +':' + object[key]+ "\r\n "
        
    })
    
    return data
    
}

SendSMS.prototype.SMSNotify  = function(phoneNumbers,object,mapping,callback){
    
  
    if(phoneNumbers.length > 0)        
        {  
            var datas = object.data
            var text = object.text_mail
            
            phoneNumbers.forEach(function(number){
               
                datas.forEach(function(line){
                    
                    SendTwilioSMS(number, BuildSMSText(line,mapping,text),function(err,message)
                           {
                      
                        callback(err,message)
                    })
                    
                })
            })
        }
}

module.exports = SendSMS;