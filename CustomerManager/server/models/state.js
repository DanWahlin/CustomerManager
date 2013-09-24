var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var StateSchema = new Schema({
  id : {
    type : Number, required: true
  },
  abbreviation : {
    type : String, required: true, trim: true
  },
  name : {
    type :  String, required: true, trim: true
  }
});

exports.StateSchema = StateSchema;
module.exports = mongoose.model('State', StateSchema);

