var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var SettingsSchema = new Schema({
  collectionName : {
    type : String, required: true, trim: true, default: 'customers'
  },
  nextSeqNumber: {
    type: Number, default: 1
  }
});

var OrderSchema = new Schema({
  product : {
    type : String, required: true, trim: true
  },
  price : {
    type : Number,
  },
  quantity : {
    type : Number,
  }
});

var CustomerSchema = new Schema({
  firstName : {
    type : String, required: true, trim: true
  },
  lastName : {
    type : String, required: true, trim: true
  },
  email : {
    type : String, required: true, trim: true
  },
  address : {
    type : String, required: true, trim: true
  },
  city : {
    type : String, required: true, trim: true
  },
  stateId : {
    type : Number, required: true
  },
  state : {
    id : {
      type : Number
    },
    abbreviation : {
      type : String, required: true, trim: true
    },
    name : {
      type :  String, required: true, trim: true
    }
  },
  zip : {
    type : Number, required: true
  },
  gender : {
    type : String,
  },
  id : {
    type : Number, required: true, unique: true
  },
  orderCount : {
    type : Number,
  },
  orders: [OrderSchema],
});

CustomerSchema.index({ id: 1, type: 1 }); // schema level

// I make sure this is the last pre-save middleware (just in case)
var Settings = mongoose.model('settings', SettingsSchema);

CustomerSchema.pre('save', function(next) {
  var doc = this;
  // Calculate the next id on new Customers only.
  if (this.isNew) {
    Settings.findOneAndUpdate( {"collectionName": "customers"}, { $inc: { nextSeqNumber: 1 } }, function (err, settings) {
      if (err) next(err);
      doc.id = settings.nextSeqNumber - 1; // substract 1 because I need the 'current' sequence number, not the next
      next();
    });
  } else {
    next();
  }
});

exports.CustomerSchema = CustomerSchema;
module.exports = mongoose.model('Customer', CustomerSchema);
