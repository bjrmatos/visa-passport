/* global describe, it, expect */

var visa = require('../lib/');

describe('visa-passport', function() {

  it('should export singleton directly from package', function() {
    expect(visa).to.be.an('object');
  });

  it('should export Visa constructor directly from package', function() {
    expect(visa.Visa).to.be.a('function');
  });

  it('should export MemoryBackend constructor directly from package', function() {
    expect(visa.MemoryBackend).to.be.a('function');
  });
});
