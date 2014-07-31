'use strict';

var path = require('path'),
    util = require('util'),
    fs = require('fs'),
    _ = require('underscore'),
    Backend = require('visa-passport-extend'),
    errors = Backend.errors;

var rules = [];

function MemoryBackend(options, proto) {
  Backend.call(this);
  this.name = 'memory';
  options = options || {};
  proto = proto || {};
  this._roleProperty = options.roleProperty || 'role';
  this._actionsProperty = options.actionsProperty || 'actions';
  options.load = options.load ||
                    path.join(process.argv[1], '..', 'config/rules.json');

  if (options.load) {
    try {
      var file = fs.readFileSync(options.load, { encoding: 'utf8' });
      rules = JSON.parse(file);
    } catch (err) {
      throw err;
    }
  }

  _.extend(MemoryBackend.prototype, proto);
}

/**
 * Inherit from `Backend`.
 */
util.inherits(MemoryBackend, Backend);

MemoryBackend.prototype.addRule = function(role, resource, actions, cb) {
  var rsrc,
      rule,
      isNewRule = false;

  if (!role || !resource || !Array.isArray(actions)) {
    return cb(new errors.InvalidArguments('Invalid arguments, ' +
                    'Call with <string>, <string>, <array>, <function>'));
  }

  rsrc = _.findWhere(rules, { role: role }) || {};

  if (!rsrc.role) {
    isNewRule = true;
    rsrc.role = '' + role;
    rsrc.permissions = [];
  }

  rule = _.findWhere(rsrc.permissions, { resource: '' + resource }) || {};

  if (rule.resource) {
    return cb(new errors.RuleExistsError('A rule with the resource: "' +
                    resource + '", already exists for this role'));
  }

  rsrc.permissions.push({
    resource: resource,
    actions: actions.map(function(value) {
      return '' + value;
    })
  });

  if (isNewRule) {
    rules.push(rsrc);
  }

  return cb(null);
};

MemoryBackend.prototype.getRules = function(resource, cb) {
  var roles = [];

  rules.forEach(function(rule) {
    var elem = _.findWhere(rule.permissions, { resource: resource });

    if (elem) {
      roles.push({
        role: rule.role,
        actions: elem.actions
      });
    }
  });

  return cb(null, roles);
};

module.exports = MemoryBackend;
