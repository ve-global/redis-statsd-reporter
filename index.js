'use strict';

var path = require('path');
var util = require('util');
var infoParser = require('./lib/info-parser');
var redisClientFactory = require('./lib/redis-client-factory');
var configDir = path.resolve(process.argv[2] || './');

var StatsD = require('statsd-client');

util.log('starting...');
util.log(`using config from ${configDir}`);

var statsConfig = require(path.join(configDir, 'statsd'));
var statsdClient = new StatsD({ host: statsConfig.host, port: statsConfig.port, debug: statsConfig.debug });

var getSuffix = function(tags){
  var suffix = '';
  if(tags.length > 0){
    suffix = `,${tags}`;
  }
  return suffix;
};

var getPrefix = function(prefix){
  var pre = '';
  if(prefix && prefix.length > 0){
    pre = `${prefix}.`;
  }
  return pre;
}

var redisClients = require(path.join(configDir, 'redis')).map(redisClientFactory);

redisClients.forEach(function(c){
  setInterval(function(){
    c.info(function(err, res){
      if(err) {
        util.log(`[${c.host}] ${err}`);
        return;
      }

      var prefix = getPrefix(c.prefix);
      var suffix = getSuffix(c.tags);

      infoParser(res).forEach(function(k){
        statsdClient.gauge(`${prefix}${k[0]}${suffix}`, k[1]);
      });
    });
  }, (statsConfig.interval || 10) * 1000);
});
