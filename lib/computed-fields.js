'use strict';

var fields = [
  {
    name: 'percent_used',
    keys: ['used_memory', 'maxmemory'],
    fn: (values) => {
      return (values[0] / values[1]).toFixed(5);
    }
  }
];

var findKey = (it, k) => {
  for(var i = 0; i < it.length; i++){
    if(it[i] && it[i][0] === k && it[i][1] !== undefined && !isNaN(it[i][1])){
      return it[i];
    }
  }
};

var computeField = (stats, op) => {
  var values = op.keys.map((k) => {
    return findKey(stats, k);
  });

  if(values.filter((v) => { return v; }).length !== op.keys.length){
    return;
  }

  values = values.map((v) => {
    return v[1];
  });

  return [op.name, op.fn.call(null, values)];
};

module.exports.get = (stats) => {
  return fields.map((c) => {
    return computeField(stats, c);
  });
};
