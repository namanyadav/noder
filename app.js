const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const exphbs = require("express-handlebars");
const hbs = require('hbs');
var http = require('http');
var debug = require('debug')('RSVP:server');

const configRoutes = require('./routes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');

const app = express();

// view engine setup
hbs.registerHelper('ifEquals', function(arg1, arg2, options) { console.log('proecessing helper'); if (arg1 == arg2) {console.log('returning true');return options.fn(this)} console.log('returning false');return options.inverse(this); });
hbs.registerHelper('ifNotEquals', function(arg1, arg2, options) { if (arg1 != arg2) {return options.fn(this)} return options.inverse(this); });
hbs.registerPartials(__dirname + '/views/partials', function (err) {});
hbs.registerPartial('partial_name', 'partial value');

// let hbs = exphbs.create({
//   defaultLayout: "main",
//   helpers: {
//     ifEquals: function(arg1, arg2, options) { if (arg1 == arg2) {return options.fn(this)} return options.inverse(this); },
//     ifNotEquals: function(arg1, arg2, options) { if (arg1 != arg2) {return options.fn(this)} return options.inverse(this); }
//   }
// })
app.engine("handlebars", exphbs(hbs));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret:'sss'}))

configRoutes(app);

// app.use('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type, access_token');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err.stack)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on http://localhost:' + addr.port);
}


module.exports = app;
