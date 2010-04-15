require('ext')

var Redis = require('redisclient')
   ,sys = require('sys')
   ,async = require('async_utils')
   ,hashlib = require("hashlib")
   ,Bookmark = exports.Bookmark = function(user, params) {
      this.user = user
      this.merge(params)
      this.id = this.id || hashlib.sha256(this.url)
    }

Bookmark.prototype = {
  get doc() {
    return JSON.stringify(this)
  },
  
  get indexes() {
    return this.tags.concat('by:' + this.user)
  }
}

Bookmark.db = new Redis.Client();

Bookmark.store = function(user, params, fn) {
  var key, tag, self = this,
      bookmark = new Bookmark(user, params);

  this.db.set(bookmark.id, bookmark.doc, function() {
    async.each(bookmark.indexes, function(tag, next) {
      self.db.sadd(tag, bookmark.id, next);
    }, function() {
      if (fn) fn(bookmark);
    });
  })
}

Bookmark.find = function(id, fn) {
  this.db.get(id, function(doc) {
    if (fn) fn(new Bookmark(doc.user, doc))
  })
}

Bookmark.findByTags = function(tags, fn) {
  var self = this
  this.db.sinter.apply(this.db, tags.concat(function(err, keys) {
    if (!keys) { fn([]); return }
    self.db.mget(keys, function(err, docs) {
      fn(self.parseDocs(docs))
    })
  }))
}

Bookmark.parseDocs = function (docs) {
  return docs.map(function(doc) {
    var data = JSON.parse(doc)
    return new Bookmark(data.user, data)
  })
}

Bookmark.findByUser = function(user, fn) {
  var self = this
  this.index.smembers("by:" + user, function(err, keys) {
    self.db.mget(keys, function(err, docs) {
      fn(self.parseDocs(docs))
    })
  })
}

Bookmark.deleteAll = function(fn) {
  var self = this
  this.db.keys("*", function(keys) {
    async.each(resp.keys, function(key, next) {
      self.db.expire(key, 0, function() {
        next()
      })
    }, fn)
  })
}

Bookmark.close = function() {
  Bookmark.db.quit()
}
