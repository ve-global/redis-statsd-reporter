'use strict';
const statsdIllegalCharacter = ':';
const defaultWordSeparatorCharacter = '-';

module.exports.getSuffix = (c, nodeName) => {
  var suffix = '';
  if(c.tags && c.tags.length > 0){
    suffix = `,${c.tags}`;
  }

  if(c.isCluster && c.nodeNames === 'tag'){
    suffix = `${suffix},node=${nodeName}`;
  }

  return suffix;
};

module.exports.getPrefix = (c, nodeName) => {
  var pre = '';
  if(c.prefix && c.prefix.length > 0){
    pre = `${c.prefix}.`;
  }

  if(c.isCluster && c.nodeNames === 'prefix'){
    pre = `${pre}${nodeName}.`;
  }

  return pre;
};

module.exports.cleanKey = (keyName) => {
  return keyName.replace(statsdIllegalCharacter, defaultWordSeparatorCharacter);
};
