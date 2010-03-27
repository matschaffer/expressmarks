require.paths.unshift("./vendor/express/lib");
require.paths.unshift("./vendor/redis-node-client");
require.paths.unshift("./vendor/riak-js/lib");

require('express');
require('express/plugins');

var redis = require('redisclient'),
    riak = require('riak-node');

get('/', function () {
  this.halt(200, "hello world");
});

run();
