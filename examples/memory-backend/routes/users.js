var express = require('express'),
    router = express.Router(),
    visa = require('../../../lib/');

router.get('/', visa.authorize({
  defaultResponse: false
}), function(req, res, next) {
  if (!req.isAuthorized()) {
    return res.send('YOU\'RE UNAUTHORIZED, THIS IS A PRIVATE PAGE!!!');
  }

  next();
}, function(req, res) {
  res.send('Welcome to the User page');
});

module.exports = router;
