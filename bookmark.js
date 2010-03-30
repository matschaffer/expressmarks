require('ext');

var Riak = require('riak-node'),
    Redis = require('redisclient'),
    sys = require('sys'),
    async = require('async_utils'),
    Bookmark = exports.Bookmark = function() {};

Bookmark.db = new Riak.Client();
Bookmark.db.defaults.debug = false;

Bookmark.index = new Redis.Client();

Bookmark.bucket = "bookmarks";

Bookmark.create = function(user, params, fn) {
  var key, tag, self = this,
      bookmark = new Bookmark();

  params.user = user
  bookmark.mergeDeep(params)

  this.db.save(this.bucket, null, params)(function(err, resp) {
    bookmark.id = resp.headers.location.split('/').last;

    params.tags.push("by:user");
    
    async.each(params.tags, function(tag, next) {
      self.index.sadd(tag, bookmark.id, function() {
        next();
      });
    }, function() {
      self.index.quit();
      if (fn) fn(bookmark);
    });
  });
};

Bookmark.findByUser = function(user, fn) {
  sys.puts("not implemented yet");
};

Bookmark.deleteDocuments = function(fn) {
  var keys, self = this;
  this.db.get(this.bucket)(function(resp) {
    async.each(resp.keys, function(key, next) {
      self.db.remove(self.bucket, key)(function() {
        next()
      })
    }, fn)
  })
}

Bookmark.deleteTags = function(fn) {
  var key, self = this;
  this.index.keys('*', function(err, keys) {
    async.each(keys, function(key, next) {
      self.index.expire(key, 1, next);
    }, function() {
      self.index.quit()
      if (fn) fn()
    })
  });
};

Bookmark.deleteAll = function(fn) {
  Bookmark.deleteDocuments(function() {
    Bookmark.deleteTags(fn);
  });
};

Bookmark.prototype = {
};