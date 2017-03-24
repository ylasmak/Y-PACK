

function PrintPDF()
{
    
}



 PrintPDF.prototype.UrlToPDF  = function(url,reportname,reportType,reportFolder,callback){
     
     var child=require('child_process');
    
     
    var args=[];
     
    args=args.concat([__dirname + '/bridge.js', url,reportname,reportType,reportFolder]);

    // console.log(args)
    var phantom=child.spawn('phantomjs',args);
    phantom.stdout.on('data',function(data){
        if(data =='200')
            {
                
                return callback(null,200)
            }       
        else
            {
        return console.log('phantom stdout: '+data);
            }
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
    
    
    
    
}

 module.exports = PrintPDF
