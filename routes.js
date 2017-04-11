var express = require('express');
var bodyParser = require('body-parser');
var otp = require('otplib/lib/totp');

var events = require('./Model/EVENTS');
var email = require('./Model/SendHtmlTemplate');
var sendSMS = require('./Model/SendSMS')
var mongo_db = require('./data_base/mongodb');
var elastickSerach = require('./Model/ESQueryDSLTools')
var printPDF = require('./Model/PrintPDF')
var reporting = require('./Model/ReportModel')


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

router.get('/Sending_report',function(req,res) {
    
    reporting.find({}).exec(function(err,result)
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
                       tmp_folder = '/tmp/'
                       result.forEach(function(report){
                           //console.log(report)
                           var pdf = new printPDF()
                           pdf.UrlToPDF(report['Dashbord_uri'],report['Name'],report['Type'],tmp_folder,
                                       function(err,result)
                                       {
                               console.log('end reporting')
                               
                           })
                           
                       })
                   }
            }
    
})
})


//Graphical UI

router.get('/',function (req,res) {
     var search = new  elastickSerach()
     search.ExecuteAllQuery('elk_open_alert',function(error,result){
         
       var emailNotification = []
       var smsNotificattion = []
       var report = []
       
    
         if(result.length > 0)
        {            
            
             
           for(let i =0;i< result.length  ;i++)
               {
                   
                  if(result[i]['_source']['Type'] == 'EMAIL')
                        {
                         
                            emailNotification.push(result[i])
                        }

                     if(result[i]['_source']['Type'] == 'SMS')
                        {
                          
                            smsNotificattion.push(result[i])
                        }

                     if(result[i]['_source']['Type'] == 'Report')
                        {
                            report.push(result[i])
                        }
                        
               }
            
         
            
                 res.render('pages/index.ejs',{
                     emailNotification : emailNotification,
                     smsNotificattion : smsNotificattion,
                     report : report
                 })
           
        }
         else
             {
                 console.log('false')
             }
         
     })
        
    
})

router.get('/addEmailNotification',urlencodedParser,function(req,res) {    
    if(req.query._id)
        {
            var search = new  elastickSerach()
                 console.log(req.query._id)
                 search.GetDocumentById(req.query._id,function(err,result){
                   if(result)
                       {                               
                             res.render('pages/emailNotification.ejs',{notification : result})
                       }
                 })
                 
                 
        }
    else
        {
             res.render('pages/emailNotification.ejs',{notification : null})
        }
  
    
    
})

router.get('/addSMSNotification',urlencodedParser,function(req,res) {
  
    if(req.query._id)
        {
            var search = new  elastickSerach()
               
                 search.GetDocumentById(req.query._id,function(err,result){
                   if(result)
                       {  
                           console.log(result)
                             res.render('pages/smsNotification.ejs',{notification : result})
                       }
                 })
                 
                 
        }
    else
        {
             res.render('pages/smsNotification.ejs',{notification : null})
        }
    
    
    
})

router.get('/addEmailReport',urlencodedParser,function(req,res) {
   
    if(req.query._id)
        {
            var search = new  elastickSerach()
                 console.log(req.query._id)
                 search.GetDocumentById(req.query._id,function(err,result){
                   if(result)
                       {  console.log(result)                            
                             res.render('pages/emailReport.ejs',{notification : result})
                       }
                 })
                 
                 
        }
    else
        {
             res.render('pages/emailReport.ejs',{notification : null})
        }
    
    
    
})

router.post('/SaveEmailNotification',urlencodedParser,function(req,res)  {
    
    var data  = req.body;
      
    let email = []
    if(Array.isArray(data.email))
        {
           email  = data.email
        }
    else
        {
         email.push(data.email)   
        }
    
      let criterias = []    
        if(Array.isArray(data.criteria))
            {
                for(i=0;i< data.criteria.length;i++)
                    {
                          let criteria = {        
                                "filed" :data.criteria[i] ,
                                "operator" :data.operator[i],
                                "value" : data.value[i]
                          }
                          criterias.push(criteria)
                    }
            }
        else
            {
                  let criteria = {        
                                "filed" :data.criteria ,
                                "operator" :data.operator,
                                "value" : data.value
                          }
                          criterias.push(criteria)

            }
    
      var entry = {    
            "Name" :  data['name'],
            "Type" : "EMAIL",
            "Title" : data['email_title'],
            "criteriaList" : criterias,
            "update_at" : new Date(),
            "Text" : data['descr'],
            "Send_to" : email,
            "Last_execution" : new Date(),
            "Index" : data['index'],
            "Frequency_min" : data['frequency']
            }
      
       var search = new  elastickSerach()
      if(! data['_id'])
          {
            
                 search.PushQuery(entry,function(err,result)
                                 {
                     if(err)
                         {
                             console.log(err)
                         }
                     else
                         {
                              req.method = 'get';
                            res.redirect('/');
                         }

                 }) 
          }
    else
        {
            search.GetDocumentById(data['_id'],function(err,result)
                                  {
                
                if(!err)
                    {
                        entry['Last_execution'] = result['_source']['Last_execution']
                          search.DeleteQuery(data['_id'],function(err,result){
                                 if(!err)
                                     {
                                       search.PushQuery(entry,function(err,result)
                                                     {
                                         if(err)
                                             {
                                                 console.log(err)
                                             }
                                         else
                                             {
                                                  req.method = 'get';
                                                res.redirect('/');
                                             }

                                     })     
                                     }
                             })
                        
                    }
                
            })
        }
      
    
  
     
    
})

router.post('/SaveSMSNotification',urlencodedParser,function(req,res){
    
     var data  = req.body;
    
    let phoneNumber = []
    if(Array.isArray(data.phoneNumber))
        {
           phoneNumber  = data.phoneNumber
        }
    else
        {
         phoneNumber.push(data.phoneNumber)   
        }
    
      let criterias = []    
        if(Array.isArray(data.criteria))
            {
                for(i=0;i< data.criteria.length;i++)
                    {
                          let criteria = {        
                                "filed" :data.criteria[i] ,
                                "operator" :data.operator[i],
                                "value" : data.value[i]
                          }
                          criterias.push(criteria)
                    }
            }
        else
            {
                  let criteria = {        
                                "filed" :data.criteria ,
                                "operator" :data.operator,
                                "value" : data.value
                          }
                          criterias.push(criteria)

            }
    
    let fileds = []
        if(Array.isArray(data.smsFileds))
        {
           fileds  = data.smsFileds
        }
    else
        {
         fileds.push(data.smsFileds)   
        }
    
      var entry = {    
            "Name" :  data['name'],
            "Type" : "SMS",
            "criteriaList" : criterias,
            "update_at" : new Date(),
            "Text" : data['descr'],
            "Send_to" : phoneNumber,
             "Column" : fileds,
            "Last_execution" : new Date(),
            "Index" : data['index'],
            "Frequency_min" : data['frequency']
            }
    
      
     var search = new  elastickSerach()
     
         if(! data['_id'])
          {
            
                 search.PushQuery(entry,function(err,result)
                                 {
                     if(err)
                         {
                             console.log(err)
                         }
                     else
                         {
                              req.method = 'get';
                            res.redirect('/');
                         }

                 }) 
          }
    else
        {
            search.GetDocumentById(data['_id'],function(err,result)
                                  {
                
                if(!err)
                    {
                        entry['Last_execution'] = result['_source']['Last_execution']
                          search.DeleteQuery(data['_id'],function(err,result){
                                 if(!err)
                                     {
                                       search.PushQuery(entry,function(err,result)
                                                     {
                                         if(err)
                                             {
                                                 console.log(err)
                                             }
                                         else
                                             {
                                                  req.method = 'get';
                                                res.redirect('/');
                                             }

                                     })     
                                     }
                             })
                        
                    }
                
            })
        }
})

router.post('/SaveEmailReport',urlencodedParser,function(req,res) {
    
       var data  = req.body;
 
    
  
    
    let email = []
    if(Array.isArray(data.email))
        {
           email  = data.email
        }
    else
        {
         email.push(data.email)   
        }
    
    
    
      var entry = {    
            "Name" :  data['name'],
            "Type" : "Report",
            "Title" : data['report_title'],
            "update_at" : new Date(),
            "Text" : data['descr'],
            "Send_to" : email,
            "Last_execution" : new Date(),
            "dashbord_url" : data['dashbord_url'],
            "execute_at" : data['frequency']
            }   
    
  
     var search = new  elastickSerach()
     search.PushQuery(entry,function(err,result)
                     {
         if(err)
             {
                 console.log(err)
             }
         else
             {
                  req.method = 'get';
                res.redirect('/');
             }
         
     })
    
})

router.get('/delete',urlencodedParser,function(req,res) {
    
     var search = new  elastickSerach()
   
     search.DeleteQuery(req.query._id,function(err,result){
         if(!err)
             {
                   req.method = 'get';
                res.redirect('/');
             }
     })
    
    
})

module.exports = router;