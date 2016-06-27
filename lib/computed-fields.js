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

var computeField = (stats, op) => {
  var values = op.keys.map((k) => {
    return stats[k];
  });

  if(values.filter((v) => { return v; }).length !== op.keys.length){
    return;
  }

  stats[op.name] = op.fn.call(null, values);

  return stats;
};

module.exports.get = (stats) => {
  fields.forEach((c) => {
    stats = computeField(stats, c);
  });

  return stats;
};
