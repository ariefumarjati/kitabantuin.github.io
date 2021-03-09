// LOAD ENV
require('dotenv').config()

// DEFILE ALL SISTEM
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// DEFINE SEQUALIZE
const { Sequelize } = require('sequelize');

// CONFIG DATABASE
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: 'localhost',
  dialect: "mysql"
});

sequelize 
.sync({ force: true })
.then(function(err) {
    console.log('It worked!');
  }, function (err) { 
         console.log('An error occurred while creating the table:', err);
  });


// view engine setup
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// DEFINE ALL ROUTE
var indexRouter = require('./routes/index');
var attributesRouter = require('./routes/attributes');
var trainingRouter = require('./routes/training');
var calculateRouter = require('./routes/calculate');
// USER ROUTE
app.use('/', indexRouter);
app.use('/attributes', attributesRouter);
app.use('/training', trainingRouter);
app.use('/calculate', calculateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render(err.status);
});

module.exports = app;
