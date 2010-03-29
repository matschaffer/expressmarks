require('./paths');
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
