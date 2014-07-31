'use strict';

var http = require('http'),
    req = http.IncomingMessage.prototype;

req.isAuthorized = function() {
  var property = '';

  if (this._visa && this._visa.instance) {
    property = this._visa.instance._authorizedProperty;
  } else {
    throw new Error('visa.initialize() middleware not in use');
  }

  return this[property] ? true : false;
};
