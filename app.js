require('./paths')
require('express')
require('express/plugins')

configure(function() {
  set('root', __dirname);
})

var redis = require('redisclient')
   ,riak = require('riak-node')
   ,handlers = require('./handlers')
   ,sys = require('sys')

get('/favicon.ico', function(file){
  this.halt(404)
})

get('/tags/*', handlers.renderTags)

get('/:user?/*', function(user, tagPath) {
  handlers.tags.apply(this, [tagPath + "/by:" + user])
})

run()
