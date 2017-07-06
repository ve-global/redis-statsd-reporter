'use strict';

module.exports = {
    count: (cl, callback) => {
        if (cl.keyCounters && cl.keyCounters.zset) {
            cl.keyCounters.zset.forEach((key) => {
                cl.zcount([key, '-inf', 'inf'], (err, res) => {
                    callback(err, { key: key, count: res });
                });
            });
        }
    }
};