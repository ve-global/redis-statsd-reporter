'use strict';

const gauges = require('./gauges');
const computedFields = require('./computed-fields');
const dbreg =  RegExp(/db\d+/i);

var splitLines = (info) => {
  var res = {};

  info.split('\r\n').forEach((f) => {
    if(!f || f.indexOf('#') > -1){
      return;
    }
    var bits = f.split(':');

    if(bits.length !== 2 || !bits[0] || !bits[1]){
      return;
    }

    res[bits[0]] = bits[1];
  });

  return res;
};

var parseStats = (info) => {
  var res = {};
  Object.keys(info).forEach((k) => {
    if(!k || !info[k] || gauges[k] === undefined){
      return;
    }

    res[k] = parseInt(info[k] || 0, 10);
  });

  return res;
};

// keyspace info is differently organised,
// so needs to be parsed differently
var parseKeyspaceInfo = (info,  stats) => {

  var dbs = Object.keys(info).filter((f) => {
    return f.match(dbreg);
  });

  dbs.forEach((dbName) => {
    info[dbName].split(',').forEach((f) => {
      var kv = f.split('=');
      if(kv.length !== 2){
        return null;
      }

      stats[`${dbName}.${kv[0]}`] = parseInt(kv[1] || 0, 10);
    });
  });

  return stats;
};

var getShardName = (info) => {
  return info['cluster_myself_name'].substring(0,7) || 'default';
};

module.exports = (infos) => {
  if(!Array.isArray(infos)){
    infos = [infos];
  }

  return infos.map((raw) => {
    var info = splitLines(raw);
    var stats = parseStats(info);
    stats = parseKeyspaceInfo(raw, stats);
    stats = computedFields.get(stats);

    return {
      name: getShardName(info),
      stats: stats
    };
  });
};
