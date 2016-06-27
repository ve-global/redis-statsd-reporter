'use strict';

module.exports.getSuffix = function(c, nodeName){
  var suffix = '';
  if(c.tags.length > 0){
    suffix = `,${c.tags}`;
  }

  if(c.isCluster && c.nodeNames === 'tag'){
    suffix = `${suffix},node=${nodeName}`;
  }

  return suffix;
};

module.exports.getPrefix = function(c, nodeName){
  var pre = '';
  if(c.prefix && c.prefix.length > 0){
    pre = `${c.prefix}.`;
  }

  if(c.isCluster && c.nodeNames === 'prefix'){
    pre = `${pre}${nodeName}.`;
  }

  return pre;
};
