Redis StatsD Reporter [![Build Status](https://travis-ci.org/andyroyle/redis-statsd-reporter.svg?branch=master)](https://travis-ci.org/andyroyle/redis-statsd-reporter)
---

A little node app that will poll one or more redis instances and push their statistics out to statsd

```
npm i -g redis-statsd-reporter
cd /usr/lib/node_modules/redis-statsd-reporter
RSRPT_CONFIG_DIR="/path/to/config/files/" node index.js
```

###Config Files

###redis.json
```javascript
[
  {
    "host": "my.redis.host",
    "port": 6379,                 // default: 6379
    "password": "foobar"          // optional,
    "prefix": "foo.bar.redis.yay" // optional,
    "tags": {                     // optional, tags are supported by the influxdb backend
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
