
// grab the things we need
var mongoose = require('mongoose');
var url = require("./../data_base/database_configuration");
var Schema = mongoose.Schema;




//var SendTo = new Schema({ Login: String });


var Reporting = new Schema({

  Name: { type: String, required: true },
  Type: { type: String, required: true},  
  Send_to: [],
  Title :{type : String},  
  Text :{ type : String},
  Update_at : Date,
  Dashbord_uri :String,      
  Last_execution : Date
  
});


 
// the schema is useless so far
// we need to create a model using it
var ReportingModel = mongoose.model('Reporting', Reporting);



// make this available to our users in our Node applications
module.exports = ReportingModel;