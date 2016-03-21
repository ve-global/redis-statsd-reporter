var redis = require('redis');

var buildTags = (tags) => {
  return Object.keys(tags || {})
    .map((k, v) => {
      return `${k}=${tags[k]}`;
    }).join(',');
};

module.exports = (c) => {
  var cl = redis.createClient({
    host: c.host,
    port: c.port,
    'enable_offline_queue': false
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

  if(c.password){
    cl.auth(c.password);
  }
  return cl;
};
