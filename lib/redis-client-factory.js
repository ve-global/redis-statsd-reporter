'use strict';

const Redis = require('ioredis');
const util = require('util');
const Async = require('async');
  
var buildTags = (tags) => {
  return Object.keys(tags || {})
    .map((k, v) => {
      return `${k}=${tags[k]}`;
    }).join(',');
};

var clusterInfo = function clusterInfo(cb) {
  var nodes = this.nodes('all');

  Async.map(nodes, (n, done) => {
    n.info((err, i) => {
      return done(err, i);
    });
  }, (err, info) => {
    if(err){
      return cb(err);
    }

    return cb(null, info);
  });
};

module.exports = (c) => {
  var cl;

  if(c.cluster){
    cl = new Redis.Cluster([{
      host: c.host,
      port: c.port,
      password: c.password
    }], {
      enableOfflineQueue: false,
      redisOptions: {
        password: c.password
      }
    });
  }
  else {
    cl = new Redis({
      host: c.host,
      port: c.port,
      password: c.password
    }, {
      enableOfflineQueue: false
    });
  }

  cl.on('error', (err) => {
    util.log(`[${c.host}] ${err}`);
  });

  cl.on('reconnecting', (data) => {
    util.log(data);
    util.log(`[${c.host}] reconnecting`);
  });

  cl.host = c.host;
  cl.tags = buildTags(c.tags);
  cl.prefix = c.prefix;
  cl.isCluster = c.cluster;
  cl.nodeNames = c.nodeNames || 'prefix';
  cl.clusterInfo = clusterInfo.bind(cl);
  cl.keyCounters = c.keyCounters;

  return cl;
};
