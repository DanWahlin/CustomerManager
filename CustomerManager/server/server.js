
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

app.configure(function () {
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

//Local Connection 
var conn = 'mongodb://localhost/customermanager';

var db;
db = new DB.startup(conn);

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

function csrf(req, res, next) {
    res.locals.token = req.session._csrf;
    next();
}

// Routes

app.get('/', routes.index);

// JSON API

var baseUrl = '/api/dataservice/';

app.get(baseUrl + 'Customers', api.customers);
app.get(baseUrl + 'Customer/:id', api.customer);
app.get(baseUrl + 'CustomersSummary', api.customersSummary);
app.get(baseUrl + 'CustomerById/:id', api.customer);

app.post(baseUrl + 'PostCustomer', api.addCustomer);
app.put(baseUrl + 'PutCustomer/:id', api.editCustomer);
app.delete(baseUrl + 'DeleteCustomer/:id', api.deleteCustomer);

app.get(baseUrl + 'States', api.states);

app.get(baseUrl + 'CheckUnique/:id', api.checkUnique);

app.post(baseUrl + 'Login', api.login);
app.post(baseUrl + 'Logout', api.logout);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function () {
    console.log("CustMgr Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
