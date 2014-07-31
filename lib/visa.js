'use strict';

var Backend = require('visa-passport-extend'),
    middleware = require('./framework/connect')();

function Visa() {
  this._userGetter = null;
  this._defaultResponse = false;
  this._roleProperty = 'role';
  this._authorizedProperty = 'authorized';
  this._framework = middleware;
}

Visa.prototype.DEFAULT_ACTIONS_MAP = {
  'get': 'view',
  'post': 'create',
  'put': 'edit',
  'delete': 'delete'
};

Visa.prototype.initialize = function(options) {
  options = options || {};
  this._defaultResponse = options.defaultResponse != null ?
                            options.defaultResponse :
                            this._defaultResponse;

  this._roleProperty = options.roleProperty != null ?
                            '' + options.roleProperty :
                            this._roleProperty;

  this._authorizedProperty = options.authorizedProperty != null ?
                            '' + options.authorizedProperty :
                            this._authorizedProperty;

  return this._framework.initialize(this);
};

Visa.prototype.authorize = function(options) {
  return this._framework.authorize(this, options);
};

Visa.prototype.getUser = function(fn, done) {
  if (typeof fn === 'function') {
    return this._userGetter = fn;
  }

  var req = fn,
      getUserInfo = this._userGetter;

  if (getUserInfo) {
    return getUserInfo(req, done);
  }

  // No user
  return done(null, null);
};

Visa.prototype.use = function(backend) {
  if (!backend instanceof Backend) {
    throw new Error('backend must be a valid instance of Backend class');
  }

  this._backend = backend;
};

Visa.prototype.addRule = function(role, resource, actions, cb) {
  this._backend.addRule(role, resource, actions, cb);
};

Visa.prototype.getRules = function(resource, callback) {
  this._backend.getRules(resource, callback);
};

module.exports = Visa;
