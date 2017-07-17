'use strict';

var should = require('should');

describe('utils', () => {
  var utils = require('../lib/utils');
  describe('prefix', () => {
    it('should set prefix to emptystring when not set', () => {
      var result = utils.getPrefix({}, 'foo');
      result.should.equal('');
    });

    it('should set prefix from the config', () => {
      var result = utils.getPrefix({
          prefix: 'bar'
        }, 'foo');
      result.should.equal('bar.');
    });

    it('should include node name in the prefix if set', () => {
      var result = utils.getPrefix({
          prefix: 'bar',
          isCluster: true,
          nodeNames: 'prefix'
        }, 'foo');
      result.should.equal('bar.foo.');
    });
  });

  describe('suffix', () => {
    it('should set the suffix to empty when there are no tags', () => {
      var result = utils.getSuffix({}, 'foo');
      result.should.equal('');
    });

    it('should set the suffix when tags are specified in config', () => {
      var result = utils.getSuffix({
          tags: 'host=foo'
        }, 'foo');
      result.should.equal(',host=foo');
    });

    it('should include the node name in the tags if set', () => {
      var result = utils.getSuffix({
          tags: 'host=foo',
          isCluster: true,
          nodeNames: 'tag'
        }, 'bar');
      result.should.equal(',host=foo,node=bar');
    });
  });

  describe('cleanKey', () => {
    it('should replace occurances of ":" with "-" in the given key', () => {
      var result = utils.cleanKey('test:key');
      result.should.equal('test-key');
    });
  });
});
