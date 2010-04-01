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

function renderTags(tagPath) {
  var self = this,
      tags = tagPath.split('/')

  Bookmark.findByTags(tags, function(bookmarks) {
    self.render('index.haml.html', { locals: { bookmarks: bookmarks }})
  })
}

function renderUserTags(user, tagPath) {
  renderTags.apply(this, [tagPath + "/by:" + user]);
}

get('/favicon.ico', function(file){
  this.halt(404)
})
get('/tags/*', renderTags)
get('/:user?/*', renderUserTags)

run()
