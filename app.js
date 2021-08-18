let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fileUpload = require('express-fileupload');
let authRoutes = require('./routes/authRoutes');
let userRoutes = require('./routes/userRoutes');
let menuRoutes = require('./routes/menuRoutes');
let tableRoutes = require('./routes/tableRoutes');
let apiRoutes = require('./routes/apiRoutes');
let billRoutes = require('./routes/billRoutes');
let mongoose = require('./monggo/monggosv');
let expressLayouts = require('express-ejs-layouts');


let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('sjdkahsdfs'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(fileUpload({
  createParentPath: true
}));

app.use(expressLayouts);


app.use('/', authRoutes);
app.use('/users',userRoutes);
app.use('/api', apiRoutes);
app.use('/menus', menuRoutes);
app.use('/tables', tableRoutes);
app.use('/bills', billRoutes);


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
