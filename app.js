require('./paths')
require('express')
require('express/plugins')

configure(function() {
  set('root', __dirname);
})

var redis = require('redisclient'),
    riak = require('riak-node'),
    handlers = require('./handlers'),
    sys = require('sys'),
    Bookmark = require('bookmark').Bookmark;

get('/:user?/*', function(user, tagPath) {
  var self = this,
      tags = tagPath.split('/')

  Bookmark.findByTags(tags.concat("by:" + user), function(bookmarks) {
    self.render('index.haml.html', { locals: { bookmarks: bookmarks }})
  })
})

run()
