// server.js

// set up ======================================================================
// get all the tools we need, packages(require), the objects
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
//another way to support db, schemas (blueprint for db)
var mongoose = require('mongoose');
//security? strageties to login?
var passport = require('passport');
//alerts msg
var flash    = require('connect-flash');
//package that logs all request:
var morgan       = require('morgan');
//look at cookies, helps stay logged it:
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
//helps from keeping loggin
var session      = require('express-session');

//how to find db:
var configDB = require('./config/database.js'); //object url

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database thru routes

//remember, this a function call:
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
