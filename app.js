var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// import fetch from 'node-fetch';
//
// if (!globalThis.fetch) {
//   globalThis.fetch = fetch;
// }

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var wineRouter = require('./routes/recipes');

const myParser = require("body-parser");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/wine', wineRouter);

//
// app.get('/', function(req, res, next) {
//   res.render('index');
// });

function getIngredient(varietal) {
  const fs = require('fs');
  let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
  return JSON.parse(rawdata).wine[varietal].ingredient
}

app.use(myParser.urlencoded({extended : true}));
//
// app.get('/wine', function(req, res, next) {
//   let varietal = req.query.varietal
//   if (varietal === 'default') {
//     let error = "you did not pick a varietal, please try again"
//     res.render('index', {error: error})
//   } else {
//     let ingredient = getIngredient(varietal)
//     // const fs = require('fs');
//     // let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
//     // let ingredient = JSON.parse(rawdata).wine[varietal].ingredient;
//     res.render('wine', { wine: varietal, ingredient: ingredient});}
// });

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
  res.render('error');
});





module.exports = app;

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
