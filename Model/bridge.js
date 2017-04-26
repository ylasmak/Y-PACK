

var page = require('webpage').create(),
  system = require('system'),
  url, output, type;
page.customHeaders={'Authorization': 'Basic '+btoa('admin:PASSWORD')};
page.viewportSize = { width: 1800, height: 2000 };
var waitTime = 15 * 1000;

if (system.args.length < 3 || system.args.length > 5) {
    console.log('Usage: phantomjs_reports.js  url environment type');
    phantom.exit(1);
} else {

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

   
       
  url = system.args[1];
  output = system.args[2];
  type = system.args[3];
  folder =  system.args[4]; 
   
    
  page.open(url, function(status) {
   // console.log("Status: " + status);
    if(status !== "success") {
    //  console.log('Unable to load the address!');
      phantom.exit();
    }else{
      window.setTimeout(function () {
      
         //var hoy = new  Date()
        // var tmphoy = hoy.getYear()+'_'+hoy.getMonth() +'_'+ hoy.getDay()+'/'
          
        var path  = folder + output+'.pdf';         
          
        page.render(path);
       console.log(path)
        //console.log('200')
        phantom.exit();
      }, waitTime);
    }
  });
}