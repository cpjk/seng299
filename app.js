var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var sessionApiRoutes = require('./app/routes/api/session');
var usersApiRoutes = require('./app/routes/api/users');
var bookableApiRoutes = require('./app/routes/api/bookable');
var bookingApiRoutes = require('./app/routes/api/booking');
var bookableTypeApiRoutes = require('./app/routes/api/bookableType');
var usersVerifyRoutes = require('./app/routes/api/usersVerify');
var usersPasswordResetRoutes = require('./app/routes/api/usersPasswordReset');
var viewRoutes = require('./app/routes/viewRoutes');
var indexRoute = require('./app/routes/indexRoute');

// view engine setup
app.set('views', path.join(__dirname, 'public/app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('express-session')({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRoute);
app.use('/partials', viewRoutes);
app.use('/api/session', sessionApiRoutes);
app.use('/api/users', usersApiRoutes);
app.use('/api/bookables', bookableApiRoutes);
app.use('/api/bookabletypes', bookableTypeApiRoutes);
app.use('/api/reset', usersPasswordResetRoutes);
app.use('/api/verify', usersVerifyRoutes); 
app.use('/api/bookings', bookingApiRoutes);
app.use('*', indexRoute);

var User = require('./app/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
