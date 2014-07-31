'use strict';

var initialize = require('../middleware/initialize'),
    authorize = require('../middleware/authorize');

module.exports = function() {

  // HTTP extensions.
  require('../http/request');

  return {
    initialize: initialize,
    authorize: authorize
  };
};
