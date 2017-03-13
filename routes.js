var express = require('express');
var bodyParser = require('body-parser');
var otp = require('otplib/lib/totp');

var events = require('./Model/EVENTS');
var email = require('./Model/SendHtmlTemplate');
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
                       for(var i = 0;i<result.length; i++)
                            {
                               var notification  = result[i]
                               
                               
                               var mail_result = {'text_mail' : notification["Text"], 'data' :[]}  
                             
                               /////////////////////////////////TEMP////////////////////////////////////////
                               /////////////////////////////////////////////////////////////////////////////
                               var criteriaList = [{'filed' : 'recu' ,'operator':'gte','value': '30000'}]
                               /////////////////////////////////////////////////////////////////////////////
                               /////////////////////////////////////////////////////////////////////////////
                               
                             var search = new  elastickSerach()
                             search.ExecuteQuery(criteriaList,"afriqua_web_transaction_performence-",function(err,searchResult)
                                                {
                                 if(err)
                                     {
                                         console.log(err)
                                     }
                                 if(searchResult)
                                     {
                                         mail_result.data = searchResult
                                         var sendSMTMail = new email()
                                         sendSMTMail.SendeMail(notification['Send_to'],notification['Title'],mail_result,function(err,result){
                                                   if(err)
                                                       {
                                                          res.send("Error 500") 
                                                       }
                                                 if(result)
                                                           {
                                                        res.send("OK 200") 
                                                           }
                                             
                                            })
                                        
                                     }
                             })
                                
                            }
                       
                   }
               else
                   {
                         res.send("OK 200")
                   }
           }
       
   })
});

module.exports = router;