require.paths.unshift("./vendor/express/lib");
require.paths.unshift("./vendor/redis-node-client");
require.paths.unshift("./vendor/riak-js/lib");

require('express');
require('express/plugins');

configure(function() {
  set('root', __dirname);
})

var redis = require('redisclient'),
    riak = require('riak-node'),
    handlers = require('./handlers');

get('/', handlers.get);

run();
