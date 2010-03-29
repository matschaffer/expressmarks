sys = require('sys');

describe("Bookmarks", function() {
  var Bookmark;
  
  before(function() {
    Bookmark = require('bookmark').Bookmark;
    Bookmark.db = require('mock-riak')
      save: function(bucket, id, data) {
        return function(fn) { if (fn) { fn(); } };
      }
    }
  });
  
  it("should store url, title, notes and tags", function() {
    Bookmark.create({
      url: "http://www.matschaffer.com",
      title: "Mat Schaffer's blog",
      notes: "My personal blog. Not sure why I'd bookmark it.",
      tags: ["programming", "ruby", "javascript", "awesome"]
    }, function(bookmark) {
      sys.p(arguments);
      expect(bookmark.title).to(eql, "Mat Schaffer blog");
    });
    this.async();
  });
});