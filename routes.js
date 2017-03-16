var express = require('express');
var bodyParser = require('body-parser');
var otp = require('otplib/lib/totp');

var events = require('./Model/EVENTS');
var email = require('./Model/SendHtmlTemplate');
var sendSMS = require('./Model/SendSMS')
var mongo_db = require('./data_base/mongodb');
var elastickSerach = require('./Model/ESQueryDSLTools')


var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})


router.get('/serach_lookup', function(req, res) {
    
   events.find({}).exec(function(err,result)
                           {
       if(err)
           {
               console.log(err)
               res.send("Error 500" + err)
           }
       else
           {
                       
               if(result &&  result.length >0)
                   {   
                      
                      // console.log(result)
                      // for(var i = 0;i<result.length; i++)
                       result.forEach(function(notification)
                            {
                              
                         
                               var mail_result = {'text_mail' : notification["Text"], 'data' :[]}  
                               criteriaList = notification["criteriaList"]
                               var nextExecutionDate = notification['Last_execution']
                               
                               nextExecutionDate.setMinutes(notification['Last_execution'].getMinutes() + notification['Frequency_min'])
                                var currentDate = new Date()   
                               
                               if(currentDate > nextExecutionDate )
                                   {
                                         console.log('in1')
                                         var search = new  elastickSerach()
                                                search.ExecuteQuery(criteriaList,notification['Index'],function(err,searchResult)
                                                     {
                                                         if(err)
                                                             {
                                                                 console.log(err)
                                                             }
                                                    
                                                         if(searchResult)
                                                             {
                                                                if(searchResult.length >0)
                                                                { 
                                                                   
                                                                    mail_result.data = searchResult
                                                                     
                                                                    if(notification['Type'] == 'EMAIL')
                                                                    {
                                                                      /* var sendSMTPMail = new email()  sendSMTPMail.SendeMail(notification['Send_to'],notification['Title'],mail_result,function(err,result){
                                                                               if(err)
                                                                                   {
                                                                                      res.send("Error 500") 
                                                                                   }


                                                                        })*/
                                                                    }
                                                               
                                                                   
                                                                  if(notification['Type'] == 'SMS')
                                                                    {
                                                                          
                                                                         var sendBySMS = new sendSMS()
                                                                         
                                                                    sendBySMS.SMSNotify(notification['Send_to'],mail_result,notification['Column'],function(err,result)
                                                                                             {
                                                                                    if(err)
                                                                                           {
                                                                                              res.send("Error 500") 
                                                                                           }
                                                                                    console.log(result)

                                                                            
                                                                        })
                                                                    }
                                                                    
                                                                }

                                                             }
                                                    }  ) 
                                                
                                   /* var mongo = new mongo_db()
                                    mongo.updateExecutionDate('events',notification['_id'], currentDate,function(err,object)
                                                             {
                                        if(err)
                                            {
                                                console.log(err)
                                                 res.send("Error 500") 
                                            }


                                    })*/
                                }
                                
                              
                                
                            })
                      // res.send("OK 200")
                       
                   }
               else
                   {
                       //  res.send("OK 200")
                   }
           }
       
   })
});

module.exports = router;