var should = require('should');

describe('info-parser', () => {
  var gauges = require('../lib/gauges');
  var info = require('./test-info');
  var parser = require('../lib/info-parser');

  describe('gauges', () => {
    Object.keys(gauges).forEach((f) => {
      it(f, () => {
        var result = parser(info);
        result[0].stats[f].should.be.a.Number();
      });
    });
  });

  describe('computed-fields', () => {
    it('percent_used', () => {
      var result = parser(info);
      result[0].stats['percent_used'].should.equal('0.12066');
    });
  });

  describe('keyspace', () => {
    describe('db0', () => {
      //keys=127,expires=0,avg_ttl=0
      it('keys', () => {
        var result = parser(info);
        result[0].stats['db0.keys'].should.equal(127);
      });
      it('expires', () => {
        var result = parser(info);
        result[0].stats['db0.expires'].should.equal(100);
      });
      it('avg_ttl', () => {
        var result = parser(info);
        result[0].stats['db0.avg_ttl'].should.equal(123);
      });
    });
  });

  describe('cluster', () => {
    it('node-name', () => {
      var result = parser(info);
      result[0].name.should.equal('0aea521');
    });
  });
})
