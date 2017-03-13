
// grab the things we need
var mongoose = require('mongoose');
var url = require("./../data_base/database_configuration");
var Schema = mongoose.Schema;


mongoose.Promise = global.Promise;
mongoose.connect( url);

//var SendTo = new Schema({ Login: String });


var EVENTS = new Schema({

  Name: { type: String, required: true },
  Type: { type: String, required: true},
  criteriaList : {type: Object, required: true }, 
  Send_to: [],
  Title :{type : String},  
  Text :{ type : String},
  update_at : String,
  Frequency_min : Number,
  Index : String,    
  Last_execution : Date    
  
});


 
// the schema is useless so far
// we need to create a model using it
var EVENTSModel = mongoose.model('EVENTS', EVENTS);



// make this available to our users in our Node applications
module.exports = EVENTSModel;