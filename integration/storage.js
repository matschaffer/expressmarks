require("../paths");

var Bookmark = require('bookmark').Bookmark,
    sys = require('sys'),
    user = "user1";

Bookmark.create(user, {
  url: "http://www.matschaffer.com",
  title: "Mat Schaffer's blog",
  notes: "My personal blog. Not sure why I'd bookmark it.",
  tags: ["programming", "ruby", "javascript", "awesome"]
}, function(bookmark) {
  sys.puts("Stored this bookmark:");
  sys.p(bookmark);
  Bookmark.deleteAll(function() { sys.puts('Finished cleaning up.'); });
});