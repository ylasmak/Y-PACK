var express = require('express');
var bodyParser = require('body-parser');
var otp = require('otplib/lib/totp');

var events = require('./Model/EVENTS');
var email = require('./Model/SendHtmlTemplate');
var sendSMS = require('./Model/SendSMS')
var mongo_db = require('./data_base/mongodb');
var elastickSerach = require('./Model/ESQueryDSLTools')
var printPDF = require('./Model/PrintPDF')
var phantom = require('node-phantom');


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

router.get('/print_pdf',function(req,res) {
    var child=require('child_process');
    
    var url ='http://192.168.121.135:5601/app/kibana#/dashboard/POC1?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now%2FM,mode:quick,to:now%2FM))&_a=(filters:!(),options:(darkTheme:!f),panels:!((col:1,id:Activit%C3%A9,panelIndex:1,row:4,size_x:10,size_y:3,type:visualization),(col:1,id:Envoye_KB,panelIndex:2,row:7,size_x:10,size_y:5,type:visualization),(col:1,id:response_time,panelIndex:3,row:1,size_x:10,size_y:3,type:visualization),(col:1,id:Top-10-service,panelIndex:4,row:12,size_x:10,size_y:5,type:visualization)),query:(query_string:(analyze_wildcard:!t,query:\'*\')),title:POC1,uiState:(P-2:(vis:(params:(sort:(columnIndex:2,direction:desc)))),P-4:(vis:(params:(sort:(columnIndex:!n,direction:!n))))))'
   
    var reportname = 'POC'
    var reportType = 'pdf'
    
    var args=[];
    

    
    args=args.concat([__dirname + '/Model/bridge.js', url,reportname,reportType ]);

    var phantom=child.spawn('phantomjs',args);
    phantom.stdout.on('data',function(data){
        return console.log('phantom stdout: '+data);
    });
    phantom.stderr.on('data',function(data){
        return console.warn('phantom stderr: '+data);
    });
    var hasErrors=false;
    phantom.on('error',function(){
        hasErrors=true;
    });
    phantom.on('exit',function(code){
        hasErrors=true; //if phantom exits it is always an error
    });
    
})



module.exports = router;