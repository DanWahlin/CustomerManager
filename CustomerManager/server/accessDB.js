// Module dependencies
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Customer = require('./models/customer')
  , State = require('./models/state')
  , util = require('util');

// connect to database
var self = module.exports = {
    // Define class variable
    myEventID: null,

    // initialize DB
    startup: function (dbToUse) {
        mongoose.connect(dbToUse);
        // Check connection to mongoDB
        mongoose.connection.on('open', function () {
            console.log('We have connected to mongodb');
        });

    },

    // disconnect from database
    closeDB: function () {
        mongoose.disconnect();
    },

    //get total customers count
    patchCustomersCount: function (result, callback) {
        console.log('*** accessDB.asyncGetCustomersCount');
        Customer.count({}, function (err, count) {
                if (err) { console.log('*** get customers count err: ' + err) };
                result.count = count;
                callback(null, result);
            });
    },

    // get all the customers
    getCustomers: function (skip, top, callback) {
        console.log('*** accessDB.getCustomers');
        var count = 0;
        Customer.find({}, { '_id': 0, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'orders': 1, 'orderCount': 1, 'gender': 1, 'id': 1 },
            function (err, customers) {
                if (err) { console.log('*** get customers err: ' + err) };
            })
        .skip(skip)
        .limit(top)
        .exec(function (err, customers) {
            self.patchCustomersCount({customers: customers}, callback);
        });
    },

    // get the customer summary
    getCustomersSummary: function (skip, top, callback) {
        console.log('*** accessDB.getCustomersSummary');
        var count = 0;
        Customer.find({}, { '_id': 0, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'orders': 1, 'orderCount': 1, 'gender': 1, 'id': 1 },
            function (err, customersSummary){ 
                if (err) { console.log('*** get customers summary err: ' + err)};
            })
      .skip(skip)
      .limit(top)
      .exec(function (err, customersSummary) {
          self.patchCustomersCount({customersSummary: customersSummary}, callback);
      });
    },

    // get a  customer
    getCustomer: function (id, callback) {
        console.log('*** accessDB.getCustomer');
        Customer.find({ 'id': id }, {}, function (err, customer) {
            if (err) { console.log('*** get customer err: ' + err)};
            callback(null, customer[0]);
        });
    },

    // insert a  customer
    insertCustomer: function (req_body, state, callback) {
        console.log('*** accessDB.insertCustomer');

        var customer = new Customer();
        var s = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name }

        customer.firstName = req_body.firstName;
        customer.lastName = req_body.lastName;
        customer.email = req_body.email;
        customer.address = req_body.address;
        customer.city = req_body.city;
        customer.state = s;
        customer.stateId = state[0].id;
        customer.zip = req_body.zip;
        customer.gender = req_body.gender;
        customer.id = 1; // The id is calculated by the Mongoose pre 'save'.

        customer.save(function (err, customer) {
            if (err) { console.log('*** new customer save err: ' + err); return callback(err); }

            callback(null, customer.id);
        });
    },

    editCustomer: function (id, req_body, state, callback) {
        console.log('*** accessDB.editCustomer');

        var s = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name }

        Customer.findOne({ 'id': id }, { '_id': 1, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'gender': 1, 'id': 1 }, function (err, customer) {
            if (err) { console.log('*** edit customer doesn\'t exist err: ' + err); return callback(err); }

            customer.firstName = req_body.firstName || customer.firstName;
            customer.lastName = req_body.lastName || customer.lastName;
            customer.email = req_body.email || customer.email;
            customer.address = req_body.address || customer.address;
            customer.city = req_body.city || customer.city;
            customer.state = s;
            customer.stateId = s.id;
            customer.zip = req_body.zip || customer.zip;
            customer.gender = req_body.gender || customer.gender;


            customer.save(function (err) {
                if (err) { console.log('*** edit customer save err: ' + err); return callback(err); }
                callback(null);
            });

        });
    },

    // delete a customer
    deleteCustomer: function (id, callback) {
        console.log('*** accessDB.deleteCustomer');
        Customer.remove({ 'id': id }, function (err, customer) {
            if (err) {
                console.log('*** delete customer err' + err);
            }
            console.log("customer: " + customer);
            callback(null);
        });
    },

    // get a  customer's email
    checkUnique: function (id, property, value, callback) {
        console.log('*** accessDB.checkUnique');
        console.log(id + ' ' + value)
        switch (property) {
            case 'email':
                Customer.findOne({ 'email': value, 'id': { $ne: id} })
                        .select('email')
                        .exec(function (err, customer) {
                            if (err) {
                                console.log('*** check unique err' + err);
                            } 
                            console.log(customer)
                            var status = (customer) ? false : true;
                            callback(null, {status: status});
                        });
                break;
        }

    },

    // get all the states
    getStates: function (callback) {
        console.log('*** accessDB.getStates');
        State.find({}, {}, function (err, states) {
            if (err) {
                console.log('*** get states err' + err);
            } 
            callback(null, states);
        });
    },

    // get a state
    getState: function (stateId, callback) {
        console.log('*** accessDB.getState');
        State.find({ 'id': stateId }, {}, function (err, state) {
            if (err) {
                console.log('*** get state err' + err);
            } 
            callback(null, state);
        });
    }


}
