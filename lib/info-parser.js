'use strict';

var gauges = require('./gauges');

var parseStats = (info) => {
  return info.split('\r\n').map((f) => {
    if(!f || f.indexOf('#') > -1){
      return;
    }
    var bits = f.split(':');

    if(bits.length !== 2 || gauges[bits[0]] === undefined){
      return;
    }

    return [bits[0], parseInt(bits[1] || 0, 10)];
  });
};

// keyspace info is differently organised,
// so needs to be parsed differently
var parseKeyspaceInfo = (info) => {
  var bits = info.split('Keyspace');

  if(bits.length !== 2 || !bits[1]){
    return [];
  }

  var result = [];

  bits[1].split('\r\n').forEach((raw) => {
    if(!raw){
      return null;
    }

    var keys = raw.split(':');
    var dbName = keys[0];
    if(keys.length !== 2 && !keys[1]){
      return null;
    }

    result = result.concat(keys[1].split(',').map((f) => {
      var kv = f.split('=');
      if(kv.length !== 2){
        return null;
      }

      return [`${dbName}.${kv[0]}`, parseInt(kv[1] || 0, 10)];
    }));
  });

  return result;
};

module.exports = (info) => {
  var res = [];
  return res.concat(
    parseKeyspaceInfo(info),
    parseStats(info)
  ).filter((f) => {
    return f !== undefined && !isNaN(f[1]);
  });
};
