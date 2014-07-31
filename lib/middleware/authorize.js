'use strict';

module.exports = function authorize(visa, options) {
  var defaultResponse,
      resource,
      action,
      pass;

  options = options || {};

  return function authorize(req, res, next) {
    var originalUrl = req.originalUrl.slice(1);

    defaultResponse = options.defaultResponse != null ?
                          (options.defaultResponse || false) :
                          visa._defaultResponse;

    // When options.resource is not passed, resource name defaults to
    // req.originalUrl, removing  initial and trailing slash.
    // ex: /resource, /resource/ to resource
    resource = options.resource ||
                  (originalUrl[originalUrl.length-1] === '/' ?
                  originalUrl.slice(0, -1) :
                  originalUrl);
    // When options.action is not passed, action name defaults to
    // visa.DEFAULT_ACTIONS_MAP[req.method]
    action = options.action || visa.DEFAULT_ACTIONS_MAP[req.method.toLowerCase()];

    visa.getUser(req, function(err, user) {
      if (err) {
        return next(err);
      }

      user = user || {};

      visa.getRules(resource, function(err, rules) {
        if (err) {
          return next(err);
        }

        pass = rules.some(function(rule) {
          var role = rule[visa._backend._roleProperty],
              actions = rule[visa._backend._actionsProperty],
              matchRole = role === user[visa._roleProperty],
              matchAction = false;

          if (Array.isArray(actions)) {
            matchAction = actions.indexOf((""+action)) >= 0;
          }

          return matchRole && matchAction;
        }, visa);

        // set-up if the request is authorized, allowing for use
        // in other middleware functions
        req[visa._authorizedProperty] = pass;

        if (!pass) {
          // If failureRedirect options is passed, redirect
          if (options.failureRedirect) {
            return res.redirect(options.failureRedirect);
          }

          // Default response
          if (defaultResponse) {
            res.status(403);

            return res.format({
              'text/plain': function() {
                res.send('Access Denied - You don\'t have permission to access: ' +
                            req.originalUrl);
              },

              'text/html': function() {
                res.send('Access Denied - You don\'t have permission to access: ' +
                            req.originalUrl);
              },

              'application/json': function() {
                res.json({
                  message: 'Access Denied - You don\'t have permission to access: ' +
                            req.originalUrl
                });
              }
            });
          }
        }

        next();
      });
    });
  };
};
