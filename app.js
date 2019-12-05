var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

/*------------------------    FVI   ------------------------------*/
var buffEyeRouter = require('./routes/FVI/buff-eye');
var buffVipEyeRouter = require('./routes/FVI/buff-vip-eye');
var buffCommentRouter = require('./routes/FVI/buff-cmt');
var buffLikeRouter = require('./routes/FVI/buff-like');
/*------------------------     ST    ------------------------------*/
var scanCommentRouter = require('./routes/ST/scan-cmt.js');
var seedingRouter = require('./routes/ST/seeding-cmt.js');
var app = express();
require('dotenv').config()


var mongoose = require('mongoose');


// Connect To Database


mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {useNewUrlParser: true});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/api/v1/buff-eye', buffEyeRouter);
app.use('/api/v1/buff-vip-eye', buffVipEyeRouter);
app.use('/api/v1/buff-cmt', buffCommentRouter);
app.use('/api/v1/scan-cmt', scanCommentRouter);
app.use('/api/v1/seeding-cmt', seedingRouter);
app.use('/api/v1/buff-like', buffLikeRouter);

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
