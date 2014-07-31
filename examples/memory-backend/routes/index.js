var express = require('express'),
    router = express.Router(),
    visa = require('../../../lib/');

/* Apply visa-authorization middleware */
router.get('/', function(req, res) {
  res.render('index', { title: 'Visa-passport' });
});

router.get('/forbidden', visa.authorize({
  resource: 'forbidden',
  action: 'view'
}), function(req, res) {
  res.render('forbidden', { title: 'Visa-passport' });
});

module.exports = router;
