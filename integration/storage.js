require("../paths");

var Bookmark = require('bookmark').Bookmark,
    sys = require('sys'),
    user = "user1";

Bookmark.create(user, {
  url: "http://www.matschaffer.com",
  title: "Mat Schaffer's blog",
  notes: "My personal blog. Not sure why I'd bookmark it.",
  tags: ["programming", "ruby", "javascript", "awesome"]
}, function() {
  sys.puts("Finished storage with these args to callback.");
  sys.p(arguments);
  Bookmark.findByUser(user, function() {
    sys.puts("Finished lookup with these args");
    sys.p(arguments);
  });
});