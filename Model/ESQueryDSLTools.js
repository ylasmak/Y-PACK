var elasticsearch = require('elasticsearch');
var uuid = require('uuid-lib');

 var client = new elasticsearch.Client({
          host: '192.168.121.135:9200'
        });


var TodayIndex = function(actionDate,index){  
 
    
    if(index.endsWith('*'))
        {
            
            index = index.substr(0,index.length - 1)
            var year = actionDate.getFullYear()
              var month = actionDate.getMonth() +1
              var day =actionDate.getDate()
              var month_string  =''
               var day_string =''

              if(month < 10)
                  {
                       month_string = '0'+month
                  }
                else
                    {
                         month_string = ''+month
                    }



              if(day<10)
                  {
                      day_string = '0'+day
                  }
                else
                    {
                    day_string = ''+day
                    }

              index_part =  year +"." + month_string + "." + day_string
              index = index + index_part;

              return index
        }
    else
        {
            return index
        }
    
}


function ESQueryDSLTools() {
    
}

var buildQuery = function (criteriaList,index,lastExecutionDate){
    
  
   
   var actionDate = new Date() 
   var index =  TodayIndex(actionDate,index)
   
  
  // index =  "afriqua_web_transaction_performence-2017.04.19"  
        
    
   var  query = {
              
                "index" : index,
                "body" : {
                    "query" : {
                        "bool" : {
                            "must" : [ ]                                        
                        }
                        }
                    }
                }
            
   
    
        var dateCritérai = {
                "range" : {
                    "@timestamp" : {
                        "gte" : lastExecutionDate
                    }
                }
            }
  
  
  
    query.body.query.bool.must.push(dateCritérai) 
  
    if(criteriaList.length >0)
        {
             
            for(var i=0;i<criteriaList.length ;i++)
                {
                    var  criteria =  criteriaList[i]
                    var tmp = {  "range": {  }  }
                    var  q = "{\""+ criteria['filed'] +"\":{\"" + criteria['operator']+"\" : \"" +criteria['value']+"\"}}";
                    
                    tmp.range = JSON.parse(q)                   
                    query.body.query.bool.must.push(tmp)
                }
             
           //console.log(JSON.stringify( query))
             return query
    
        }
    return null
   
}

ESQueryDSLTools.prototype.ExecuteAllQuery = function(index,callback){
    
    var result = []
    client.ping({
      // ping usually has a 3000ms timeout
      requestTimeout: 5000
        }, function (error) {
          if (error) {
            console.trace('elasticsearch cluster is down!');
          } else {
              
           
              var  query = {
                "size" : 1024,
                "index" : index,
                "body" : {
                    "query" : {
                         "match_all" : {}
                        }
                    }
                }
                  
              client.search(query).then(function (body,err) {

                      if(err)
                          {
                              console.log(err)
                              callback(err,"")
                          }
                      if(body)
                         {
                        
                             var hits = body.hits.hits;
                            

                             if(hits.length > 0)
                                 {
                                     for(j=0;j<hits.length;j++)
                                         {
                                                
                                            result.push(hits[j])
                                         }
                                     
                                 }
                            
                             callback(null,result)
                         }
                }
             );
          }
        });
}


ESQueryDSLTools.prototype.ExecuteQuery = function(criteriaList,index,lastExecutionDate,callback){
    
    var result = []
    client.ping({     
      requestTimeout: 5000
        }, function (error) {
          if (error) {
            console.trace('elasticsearch cluster is down!');
          } else {
              
           
              var  query = buildQuery(criteriaList,index,lastExecutionDate)   
              
            
              
                  
              client.search(query).then(function (body,err) {

                      if(err)
                          {
                              console.log(err)
                              callback(err,"")
                          }
                      if(body)
                         {
                          //console.log(JSON.stringify( body))
                             var hits = body.hits.hits;

                             if(hits.length > 0)
                                 {
                                     for(j=0;j<hits.length;j++)
                                         {

                                            result.push(hits[j]['_source'])
                                         }
                                     
                                 }
                             // console.log(result)
                             callback(null,result)
                         }
                }
             );
          }
        });
}


ESQueryDSLTools.prototype.PushQuery = function(document,callback){
    
    var guid = uuid.raw()
      
    client.create({
          index: 'elk_open_alert',
          type: 'alert',
          refresh : 'true',
          id:  guid,
          body: document
        }, function (error, response) {
          if(error)
              {
                  console.log(error)
              }
        
        callback(error,response)
});
}

ESQueryDSLTools.prototype.DeleteQuery = function(_id, callback) {
    
    client.delete({
              index: 'elk_open_alert',
              type: 'alert',
              refresh : 'true',
              id: _id
            }, function (error, response) {
       
               callback(error,response)
            });
}

ESQueryDSLTools.prototype.GetDocumentById = function(_id,callback){
    
        client.get({
              index: 'elk_open_alert',
              type: 'alert',
              id: _id
            }, function (error, response) {
             
                callback(error,response)
            });
    
}


ESQueryDSLTools.prototype.GetReportTypeQuery = function(callback){
    
     
     var result = []
      var  query = {
              
                "index" : 'elk_open_alert',
                "body" : {
                    "query" : {
                        "match" :{
                            "Type" : "Report"
                        }
                       
                        }
                    }
                }
    
    
      client.search(query).then(function (body,err)
     {
            if(err)
                          {
                              console.log(err)
                              callback(err,"")
                          }
                      if(body)
                         {
                       
                             var hits = body.hits.hits;

                             if(hits.length > 0)
                                 {
                                     for(j=0;j<hits.length;j++)
                                         {

                                            result.push(hits[j]['_source'])
                                         }
                                     
                                 }
                       
                             callback(null,result)
                         }
          
          
      })
      
   
    
}

ESQueryDSLTools.prototype.UpdateLastExecutionDate = function(_id,executionDate,callback){
    
    client.update({
          index: 'elk_open_alert',
          type: 'alert',
          refresh : 'true',
          id: _id,
          body: {
            
            doc: {
              Last_execution: executionDate
            }
          }
        }, function (error, response) {
                callback(error,response)
         
        })
    
} 


module.exports = ESQueryDSLTools
