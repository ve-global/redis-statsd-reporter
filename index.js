'use strict';
let defaultInterval = 10;
let oneSecInMs = 1000;
let zsetMetricAppendName = "zset"
const path = require('path');
const util = require('util');
const infoParser = require('./lib/info-parser');
const redisClientFactory = require('./lib/redis-client-factory');
const libUtils = require('./lib/utils');
let keyCounter = require('./lib/redis-key-counter');
var configDir = path.resolve(process.argv[2] || './');

const StatsD = require('statsd-client');

util.log('starting...');
util.log(`using config from ${configDir}`);

var statsConfig = require(path.join(configDir, 'statsd'));
var statsdClient = new StatsD({ host: statsConfig.host, port: statsConfig.port, debug: statsConfig.debug });

var redisClients = require(path.join(configDir, 'redis')).map(redisClientFactory);

redisClients.forEach((c) => {
  setInterval(() => {
    var action = c.isCluster ? 'clusterInfo' : 'info';

    c[action]((err, res) => {
      if (err) {
        util.log(`[${c.host}] ${err}`);
        return;
      }

      infoParser(res).forEach((shard) => {
        var prefix = libUtils.getPrefix(c, shard.name);
        var suffix = libUtils.getSuffix(c, shard.name);

        Object.keys(shard.stats).forEach((k) => {
          statsdClient.gauge(`${prefix}${k}${suffix}`, shard.stats[k]);
        });

      });
    });

    keyCounter.count(c, (err, stat) => {
      var prefix = libUtils.getPrefix(c, zsetMetricAppendName);
      var suffix = libUtils.getSuffix(c, zsetMetricAppendName);

      if (err) {
        util.log(`[${c.host}] ${err}`);
        return;
      }

      statsdClient.gauge(`${prefix}${stat.key}${suffix}`, stat.count);
    });

  }, (statsConfig.interval || defaultInterval) * oneSecInMs);
});
