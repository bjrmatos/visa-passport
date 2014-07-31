'use strict';

var Visa = require('./visa'),
    MemoryBackend = require('./backends/memory');

/**
 * Export default singleton.
 *
 */
exports = module.exports =  new Visa();

/**
 * Expose constructors.
 */
exports.Visa = Visa;
exports.MemoryBackend = MemoryBackend;
