require('ext');

var Riak = require('riak-node'),
    Redis = require('redisclient'),
    sys = require('sys'),
    Bookmark = exports.Bookmark = function() {};

Bookmark.db = new Riak.Client();
Bookmark.index = new Redis.Client();

Bookmark.bucket = "bookmarks";

Bookmark.create = function(user, params, fn) {
  var key, tag, self = this,
      bookmark = new Bookmark();

  params.user = user;
  Ext.extend(bookmark, params);
  
  this.db.save(this.bucket, null, params)(function(err, resp) {
    key = resp.headers.location.split('/').last;
    
    self.index.connect(function() {
      params.tags.push("by:user");

      function storeTags(tags) {
        if (tags.isEmpty) {
          self.index.quit();
          if (fn) fn(key);
        } else {
          tag = tags.first;
          self.index.rpush(tag, key, function() {
            sys.puts("rpush'd " + tag);
            storeTags(tags.drop(1));
          });
        }
      }
      storeTags(params.tags);
    });
  });
};

Bookmark.findByUser = function(user, fn) {
  sys.puts("finding");
  this.db.get(this.bucket)(function(resp) {
    sys.puts("found");
    fn(arguments);
  });
};

Bookmark.prototype = {
};