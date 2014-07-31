var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    routes = require('./routes/index'),
    users = require('./routes/users'),
    app = express(),
    visa = require('../../lib/');

// visa setup
visa.getUser(function(req, done) {
  done(null, req.user);
});

visa.use(new visa.MemoryBackend());

visa.addRule('special-person', 'payment', ['view', 'read'], function(err) {
  if (err) { console.error(err); }
});

visa.addRule('special-person', 'user', ['view', 'read'], function(err) {
  if (err) { console.error(err); }
});

// this should throw error
visa.addRule('special-person', 'forbidden', ['view', 'read'], function(err) {
  if (err) { console.error(err); }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

/* Set-up fake user */
app.use(function(req, res, next) {
  // fake user
  req.user = {};
  req.user.role = 'special-person';
  next();
});

app.use(visa.initialize({ defaultResponse: true }));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

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

if (!module.parent) {
  app.set('port', process.env.PORT || 3000);

  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
}

module.exports = app;
