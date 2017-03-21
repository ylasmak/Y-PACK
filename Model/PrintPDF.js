
var pdf = require('html-pdf');
var requestify = require('requestify');
var externalURL= 'http://www.google.com';

function PrintPDF()
{
    
}



 PrintPDF.prototype.UrlToPDF  = function(externalURL,path){
    
     requestify.get(externalURL).then(function (response) {
       // Get the raw HTML response body
       var html = response.body; 
       var config = {format: 'A4'}; // or format: 'letter' - see https://github.com/marcbachmann/node-html-pdf#options

    // Create the PDF
       pdf.create(html, config).toFile('generated.pdf', function (err, res) {
          if (err) return console.log(err);
          console.log(res); // { filename: '/pathtooutput/generated.pdf' }
       })
    })  
}

 module.exports = PrintPDF
