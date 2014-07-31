'use strict';

module.exports = function initialize(visa) {
  return function initialize(req, res, next) {
    req._visa = {};
    req._visa.instance = visa;
    next();
  };
};
