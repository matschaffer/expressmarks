require("../paths");

var Bookmark = require('bookmark').Bookmark,
    sys = require('sys'),
    user = "user1";

Bookmark.store(user, {
  url: "http://www.matschaffer.com",
  title: "Mat Schaffer's blog",
  notes: "My personal blog. Not sure why I'd bookmark it.",
  tags: ["programming", "ruby", "javascript", "awesome"]
}, function(bookmark) {
  sys.puts("Stored this bookmark:");
  sys.p(bookmark);
  
  Bookmark.findByTags("programming", "ruby", "by:user1", function(bookmarks) {
    sys.p(bookmarks);
    Bookmark.index.quit();
  })
  
  //bookmark.url = "http://www.google.com"
  //Bookmark.store(bookmark.user, bookmark, function() {
  //  sys.puts("updated bookmark "+bookmark.id)
  //  Bookmark.index.quit();
  //});
  
  //Bookmark.find('Cgvr14tMFlWnFyc6nlKG56247OC', function() { sys.p(arguments); })
  
  //Bookmark.findByUser(user, function(bookmarks) {
  //  sys.p(bookmarks)
  //  Bookmark.deleteAll(function() { 
  //    sys.puts('Finished cleaning up.'); 
  //    Bookmark.index.quit();
  //  });
  //});
});