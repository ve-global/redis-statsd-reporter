Redis StatsD Reporter [![Build Status](https://travis-ci.org/ve-interactive/redis-statsd-reporter.svg?branch=master)](https://travis-ci.org/ve-interactive/redis-statsd-reporter) 
---

A little node app that will poll one or more redis instances and push their statistics out to statsd

```
npm i -g redis-statsd-reporter
redis-statsd /path/to/config/files/
```

###Config Files

###redis.json
```javascript
[
  {
    "host": "my.redis.host",
    "port": 6379,                  // default: 6379
    "password": "foobar",          // optional,
    "prefix": "foo.bar.redis.yay", // optional,
    "tags": {                      // optional, tags are supported by the influxdb backend
      "foo": "bar"
    }
  },
  {
     //...
  }
]
```

###statsd.json
```javascript
{
  "host": "localhost",
  "port": 8125,       // default: 8125
  "interval": 10      // how often to poll the redis servers, default: 10
}
```

###Metrics

####Server wide metrics
- blocked_clients
- connected_clients
- instantaneous_ops_per_sec
- latest_fork_usec
- migrate_cached_sockets
- uptime_in_seconds
- used_memory
- used_memory_lua
- used_memory_peak
- used_memory_rss
- evicted_keys
- expired_keys
- keyspace_hits
- keyspace_misses
- rejected_connections
- sync_full
- sync_partial_err
- sync_partial_ok
- total_commands_processed
- total_connections_received
- instantaneous_input_kbps
- instantaneous_output_kbps
- bytes_received_per_sec*
- bytes_sent_per_sec*

(* `bytes_sent/recieved_per_sec` was changed in favour of `instantaneous_output/input_kbps` version 3.0.7 of redis-server)

####Per-DB metrics
- keys
- expires
- avg_ttl
