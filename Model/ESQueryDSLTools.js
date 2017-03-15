var elasticsearch = require('elasticsearch');

 var client = new elasticsearch.Client({
          host: '192.168.121.135:9200'
        });


var TodayIndex = function(actionDate,index){  
 
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


function ESQueryDSLTools() {
    
}

var buildQuery = function (criteriaList,index){
    
  
   
    var actionDate = new Date() 
   var index =  TodayIndex(actionDate,index)
   
  
      
    
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
            
      var actionDate1 = new Date()    
      actionDate1.setDate(actionDate1.getDate() - 1)
    
   

    
        var dateCritérai = {
                "range" : {
                    "@timestamp" : {
                        "gte" : actionDate1
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
             
             return query
    
        }
    return null
   
}

ESQueryDSLTools.prototype.ExecuteQuery = function(criteriaList,index,callback){
    
    var result = []
    client.ping({
      // ping usually has a 3000ms timeout
      requestTimeout: 5000
        }, function (error) {
          if (error) {
            console.trace('elasticsearch cluster is down!');
          } else {
              
           
              var  query = buildQuery(criteriaList,index)   
             console.log(JSON.stringify(query))
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

                                            result.push(hits[j]['_source'])
                                         }
                                     
                                 }
                            
                             callback(null,result)
                         }
                }
             );
          }
        });
}

module.exports = ESQueryDSLTools
