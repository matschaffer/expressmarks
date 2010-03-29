require("../paths");

var Bookmark = require('bookmark').Bookmark,
    sys = require('sys'),
    user = "user1";

Bookmark.create(user, {
  url: "http://www.matschaffer.com",
  title: "Mat Schaffer's blog",
  notes: "My personal blog. Not sure why I'd bookmark it.",
  tags: ["programming", "ruby", "javascript", "awesome"]
}, function(key) {
  sys.p("Created " + key);
  Bookmark.findByUser(user, function(bookmarks) {
    sys.p(bookmarks);
  });
});