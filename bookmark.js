require('ext');

var Riak = require('riak-node'),
    sys = require('sys'),
    Bookmark = exports.Bookmark = function() {};

Bookmark.db = new Riak.Client();

Bookmark.bucket = "bookmarks";

Bookmark.create = function(user, params, fn) {
  params.user = user;
  
  this.db.save(this.bucket, null, params)(function(err, resp) {
    var key = resp.headers.location.split('/').last;
    
    if (fn) fn(key);
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