'use strict';

var should = require('should');

describe('redis-key-counter', () => {
    var keyCounter = require('../lib/redis-key-counter');

    describe('should return client result', () => {
        var fakeClient = {};
        fakeClient.keyCounters = { zset: [ 'temp' ] };
        fakeClient.zcount = (arr, cb) => {
            cb(null, 2);
        };

        keyCounter.count(fakeClient, (err, res) => {
            res.key.should.be.exactly('temp');
            res.count.should.be.exactly(2);
        });
    });
});