



function SendSMS() {
      console.log('phoneNumbers')
}


var SendTwilioSMS = function(PhoneNumber,text,calllback){
    
   var accountSid = 'AC2f9abe85ad8dffdb2dd94f9e975ce8f9';
   var authToken = 'f840a2eaaf3f7d1a1c6cf89b50610789';
    var client = require('twilio')(accountSid, authToken);
    
    console.log(PhoneNumber)
    console.log(text)
    client.messages.create({
	to: PhoneNumber,
	from: '+14438254761',
	body: text,
        }, function (err, message) {
           if(err)
               {
                  console.log(err)
                   
               }
        
                console.log(message)
            calllback(err,message)
     });
}

var BuildSMSText = function(object,mapping,text,callback){
    
    var data =text +" " 
    console.log(object)
    
    mapping.forEach(function(key) {
        
        data = data + key +':' + object[key]+ " "
        
    })
    console.log(data)
    return data
    
}

SendSMS.prototype.SMSNotify  = function(phoneNumbers,object,mapping,callback){

    console.log('SMSNotify')
    
    if(phoneNumbers.length >0)        
        {
            
            
            var datas = object.data
            var text = object.text_mail
            
            phoneNumbers.forEach(function(number){
                console.log(datas.length)
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