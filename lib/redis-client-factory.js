'use strict';

var Redis = require('ioredis');
var util = require('util');

var buildTags = (tags) => {
  return Object.keys(tags || {})
    .map((k, v) => {
      return `${k}=${tags[k]}`;
    }).join(',');
};

module.exports = (c) => {
  var cl = new Redis({
    host: c.host,
    port: c.port,
    password: c.password
  }, {
    enableOfflineQueue: false
  });

  cl.on('error', (err) => {
    util.log(`[${c.host}] ${err}`);
  });

  cl.on('reconnecting', (data) => {
    util.log(`[${c.host}] reconnecting (delay: ${data.delay}, attempt: ${data.attempt})`);
  });

  cl.host = c.host;
  cl.tags = buildTags(c.tags);
  cl.prefix = c.prefix;

  return cl;
};
