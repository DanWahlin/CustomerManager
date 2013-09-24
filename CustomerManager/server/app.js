
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , DB = require('./accessDB').AccessDB
  , protectJSON = require('./lib/protectJSON');

var app = module.exports = express();

var DB = require('./accessDB');

// Configuration

app.configure(function(){
  app.use(protectJSON);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser()); //*
  app.use(express.session({ secret: 'gopalapuram' })); //*
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/../'));
  app.use(app.router);
});

var conn = 'mongodb://localhost/custmgr';
var db;
db = new DB.startup(conn);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function csrf(req, res, next) {
  res.locals.token = req.session._csrf;
  next();
}

// Routes

app.get('/', routes.index);

// JSON API

app.get('/api/dataservice/Customers', api.customers);
app.get('/api/dataservice/Customer/:id', api.customer);
app.post('/api/dataservice/PostCustomer', api.addCustomer);
app.put('/api/dataservice/PutCustomer/:id', api.editCustomer);
app.delete('/api/dataservice/DeleteCustomer/:id', api.deleteCustomer);

app.get('/api/dataservice/States', api.states);

app.get('/api/dataservice/CustomersSummary', api.customersSummary);
app.get('/api/dataservice/CustomerById/:id', api.customer);
app.get('/api/dataservice/CheckUnique/:email', api.checkemail);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("CustMgr Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
