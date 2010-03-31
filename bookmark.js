require('ext');

var Riak = require('riak-node'),
    Redis = require('redisclient'),
    sys = require('sys'),
    async = require('async_utils'),
    Bookmark = exports.Bookmark = function(user, params) {
      this.user = user
      this.merge(params)
    };

Bookmark.prototype = {
  get doc() {
    var doc = {}
    doc.merge(this)
    delete doc.id
    return doc
  },
  
  get indexes() {
    return this.tags.concat('by:' + this.user)
  }
}

Bookmark.db = new Riak.Client();
Bookmark.db.defaults.debug = false;
Bookmark.bucket = "bookmarks";

Bookmark.index = new Redis.Client();

Bookmark.store = function(user, params, fn) {
  var key, tag, self = this,
      bookmark = new Bookmark(user, params);

  this.db.save(this.bucket, bookmark.id, bookmark.doc)(function(err, resp) {
    bookmark.id = bookmark.id || resp.headers.location.split('/').last;

    async.each(bookmark.indexes, function(tag, next) {
      self.index.sadd(tag, bookmark.id, function() {
        next();
      });
    }, function() {
      if (fn) fn(bookmark);
    });
  });
};

Bookmark.find = function(id, fn) {
  this.db.get(this.bucket, id)(function(doc) {
    if (fn) fn(new Bookmark(doc.user, doc))
  })
}

Bookmark.mapKeys = function(v, keydata, keys) {
  if (v.values && keys.indexOf(v.key) != -1) {
    var data = Riak.mapValuesJson(v)[0];
    data.id = v.key;
    return [data];
  } else {
    return [];
  }
};

Bookmark.findByTags = function(tags, fn) {
  var self = this

  this.index.sinter.apply(this.index, tags.concat(function(err, keys) {
    if (!keys) { fn([]); return }

    var query = { inputs: self.bucket,
                  query: [ {map: {source: self.mapKeys, arg: keys}} ] };
    self.db.mapReduce(query)(function(docs) {
      fn(docs.map(function(doc) {
        return new Bookmark(doc.user, doc)
      }))
    })
  }))
}

Bookmark.findByUser = function(user, fn) {
  var bookmarks = [], self = this
  this.index.smembers("by:" + user, function(err, keys) {
    async.each(keys, function(key, next) {
      self.db.get(self.bucket, key)(function(doc) {
        bookmarks.push(new Bookmark(user, doc))
        next()
      })
    }, function() {
      if (fn) fn(bookmarks)
    })
  })
}

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
    }, fn)
  });
};

Bookmark.deleteAll = function(fn) {
  Bookmark.deleteDocuments(function() {
    Bookmark.deleteTags(fn);
  });
};