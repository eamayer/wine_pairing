var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var myParser = require("body-parser");
var app = express();

// router set up
var homepageRouter = require('./routes/main_page');
var recipesListRouter = require('./routes/recipes_list');
var fullRecipeDisplayedRouter = require('./routes/full_recipe_displayed');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.set('view engine', 'hbs');

//development logger setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/', homepageRouter);  //home page
app.use('/recipes_list', recipesListRouter); //recipe results page
app.use('/full_recipe_displayed', fullRecipeDisplayedRouter); //redirects to recipe page

//error
app.use(myParser.urlencoded({extended : true}));
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
