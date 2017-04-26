

function PrintPDF()
{
    
}

 PrintPDF.prototype.UrlToPDF  = function(url,reportname,reportType,reportFolder,callback){
     
    var printReport = 0;
     var child=require('child_process');
    
     
    var args=[];
     
    args=args.concat([__dirname + '/bridge.js', url,reportname,reportType,reportFolder]);

    // console.log(args)
    var phantom=child.spawn('phantomjs',args);
     
    phantom.stdout.on('data',function(data){
          
       
        value =data.toString('utf8') 
       
        if(value.trim() == '200')
            {
                return callback(200,null)
               
            }       
        
    });
     
    phantom.stderr.on('data',function(data){
         return callback(500,'phantom stderr: '+data);
    });
    var hasErrors=false;
    phantom.on('error',function(){
          return callback(500,'phantom stderr: Error ');
    });
    phantom.on('exit',function(code){
       // hasErrors=true; //if phantom exits it is always an error
       if(code!=0){
        return callback(500,'phantom exit: '+code);
       }
    });
    
   }


 module.exports = PrintPDF
