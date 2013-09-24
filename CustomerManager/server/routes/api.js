var db = require('../accessDB')
  , util = require('util');

// GET
exports.customers = function (req, res) {
  console.log('*** customers');

  db.getCustomers(function(err, customers) {
    if (err) {
      console.log('*** customers err');
      res.json({
        customers: customers
      });
    } else {
      console.log('*** customers ok');

      res.json(customers);
    }
  });
};

exports.customer = function (req, res) {
  console.log('*** customer');

  db.getCustomer(req.params.id, function(err, customer) {
    if (err) {
      console.log('*** customer err');
      res.json({
        customer: customer
      });
    } else {
      console.log('*** customer ok');

      res.json(customer);
    }
  });
};

exports.addCustomer = function (req, res) {
  console.log('*** addCustomer');
  db.getState(req.body.stateId, function(err, state) {
    if (err) {
      console.log('*** getState err');
      res.json({'status': false});
    } else {
      db.insertCustomer(req.body, state, function(err){
        if (err) {
          console.log('*** addCustomer err');
          res.json(false);
        } else {
          console.log('*** addCustomer ok');

          res.json(req.body);
        }
      });
    }
  });
};

 exports.editCustomer = function (req, res) {
  console.log('*** editCustomer');

  db.getState(req.body.stateId, function(err, state) {
    if (err) {
      console.log('*** getState err');
      res.json({'status': false});
    } else {
      db.editCustomer(req.params.id, req.body, state, function(err) {
        if (err) {
          console.log('*** editCustomer err' + util.inspect(err));
          res.json({'status': false});
        } else {
          console.log('*** editCustomer ok');

          res.json({'status': true});
        }
      });
    }
  });
};

exports.deleteCustomer = function (req, res) {
  console.log('*** deleteCustomer');

  db.deleteCustomer(req.params.id, function(err) {
    if (err) {
      console.log('*** deleteCustomer err');
      res.json({'status': false});
    } else {
      console.log('*** deleteCustomer ok');
      res.json({'status': true});
    }
  });
};

// GET
exports.states = function (req, res) {
  console.log('*** states');
  db.getStates(function(err, states) {

    if (err) {
      console.log('*** states err');
      res.json({
        states: states
      });
    } else {
      console.log('*** states ok');
      res.json(states);
    }
  });
};

exports.customersSummary = function (req, res) {
  console.log('*** customersSummary');
  db.getCustomersSummary(function(err, customersSummary) {
    if (err) {
      console.log('*** customersSummary err');
      res.json({
        data: customersSummary
      });
    } else {
      console.log('*** customersSummary ok');
      res.json(customersSummary);
    }
  });
};

exports.checkemail = function (req, res) {
  console.log('*** checkemail');

  db.getCustomerEmail(req.query.value, function(err, customer) {
    if (err) {
      console.log('*** getCustomerEmail err');
      res.json({
        customer: customer
      });
    } else {
      console.log('*** getCustomerEmail ok');
      res.json({'status': (customer === undefined)});
    }
  });
};





