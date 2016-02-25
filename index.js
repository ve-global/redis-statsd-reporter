'use strict';

var path = require('path');
var util = require('util');
var configDir = path.resolve(process.env.RSRPT_CONFIG_DIR || './');

var async = require('async');
var redis = require('redis');
var StatsD = require('statsd-client');

util.log('starting...');
util.log(`using config from ${configDir}`);

var gauges = {
  "blocked_clients":            0,
  "connected_clients":          0,
  "instantaneous_ops_per_sec":  0,
  "latest_fork_usec":           0,
  "migrate_cached_sockets":     0,
  "uptime_in_seconds":          0,
  "used_memory":                0,
  "used_memory_lua":            0,
  "used_memory_peak":           0,
  "used_memory_rss":            0,
  "evicted_keys":               0,
  "expired_keys":               0,
  "keyspace_hits":              0,
  "keyspace_misses":            0,
  "rejected_connections":       0,
  "sync_full":                  0,
  "sync_partial_err":           0,
  "sync_partial_ok":            0,
  "total_commands_processed":   0,
  "total_connections_received": 0,
  "instantaneous_input_kbps":   0,
  "instantaneous_output_kbps":  0
}

var statsConfig = require(path.join(configDir, 'statsd'));
var statsdClient = new StatsD({ host: statsConfig.host, port: statsConfig.port });

var buildTags = function(tags){
  return Object.keys(tags || {})
    .map(function(k, v){ 
      return `${k}=${tags[k]}`; 
    }).join(',')
};

var parseStats = function(info, prefix, tags){
  return info.split('\r\n').map(function(f){
    if(!f || f.indexOf('#') > -1){
      return;
    }
    var bits = f.split(':');

    if(bits.length != 2 || gauges[bits[0]] === undefined){
      return;
    }

    var suffix = '';
    if(tags.length > 0){
      suffix = `,${tags}`;
    }

    var pre = '';
    if(prefix && prefix.length > 0){
      pre = `${prefix}.`;
    }

    return [`${pre}${bits[0]}${suffix}`, parseInt(bits[1], 10)];
  }).filter(function(f){ 
    return f !== undefined && !isNaN(f[1]); 
  });
};

var redisClients = require(path.join(configDir, 'redis')).map(function(c){
  var cl = redis.createClient({ host: c.host, port: c.port });

  cl.on('error', function(err){
    util.log(`[${c.host}] ${err}`);
  });

  cl.on('reconnecting', function(data){ 
    util.log(`[${c.host}] reconnecting (${data.attempts})`);
  });

  cl.tags = buildTags(c.tags);
  cl.prefix = c.prefix;

  if(c.password){
    cl.auth(c.password);
  }
  return cl;
});

setInterval(function() { 
  async.each(redisClients, function(c, done){
    c.info(function(err, res){
      if(err){
        return done(err);
      }
 
      parseStats(res, c.prefix, c.tags).forEach(function(k){ 
        statsdClient.gauge(k[0], k[1]);
      });

      return done();
    });
  }, function(err){
    if(err){
      util.log(err);
    }
  });
}, (statsConfig.interval || 10) * 1000);
