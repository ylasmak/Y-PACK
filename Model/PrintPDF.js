

function PrintPDF()
{
    
}

 PrintPDF.prototype.UrlToPDF  = function(url,reportname,reportFolder,callback){
     
    var printReport = 0;
     var child=require('child_process');
    
     
    var args=[];
     
    args=args.concat([__dirname + '/bridge.js', url,reportname,'pdf',reportFolder]);

   // console.log(args)
    var phantom=child.spawn('phantomjs',args);
     
    phantom.stdout.on('data',function(data){
       
        value =data.toString('utf8').trim() 
        console.log(value)
        return callback(value,null)
        
    });
     
    phantom.stderr.on('data',function(data){
         return callback(500,'phantom stderr: '+data);
    });
    var hasErrors=false;
    phantom.on('error',function(){
          return callback(null,'phantom stderr: Error ');
    });
    phantom.on('exit',function(code){
       // hasErrors=true; //if phantom exits it is always an error
       if(code!=0){
        return callback(null,'phantom exit: '+code);
       }
    });
    
   }


 module.exports = PrintPDF
