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
    "cluster": false,              // optional (default false)
    "nodeNames": "prefix",         // optional "tag" or "prefix" (default "prefix"),
    "prefix": "foo.bar.redis.yay", // optional,
    "keyCounters": {
      "zset": [ "sampleKey" ]
    },
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
- maxmemory
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

#### Key specific metrics
- zcount for zset

####Per-DB metrics
- keys
- expires
- avg_ttl

####Computed fields
- percent_used (calculated from used_memory and maxmemory, where available)

###Redis Cluster support
This module supports redis clustering out-of-the-box. The two relevant configuration options are:

`cluster` - values: `true` or `false`

Tells the redis driver to treat the given server as part of a cluster.

When clustering is turned on, the INFO command is sent to all members and the stats are logged per-cluster member.

`nodeNames` - values: `"tag"` or `"prefix"`

Defines whether you want the node-name (`cluster_myself_name`) to be part of the measurement name ('prefix') or appended as a tag (`tag`). Tags are only supported by the statsd influxdb backend. If you are unsure, leave this parameter unset.

__Note__: The `nodeNames` parameter is ignored when `cluster = false`
