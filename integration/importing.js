require("../paths")

var sys      = require("sys")
   ,fs       = require("fs")
   ,Bookmark = require('bookmark').Bookmark
   ,user = "schapht"
   ,dataFile = __dirname + "/../data/schapht.posts.xml"

fs.readFile(dataFile, function(err, data) {
  var reader = {
    process: function() {},
    finish: function() {},
    read: function() {
      match = this.buffer.match(/<post [^>]*>/)
      if (match) {
        str = match[0]
        this.buffer = this.buffer.substr(str.length)
        this.process({ url:   str.match(/href="([^"]*)"/)[1],
                       title: str.match(/description="([^"]*)"/)[1],
                       tags:  str.match(/tag="([^"]*)"/)[1].split(" ") })
      } else {
        this.finish();
      }
    }
  }
  
  reader.buffer = data
  reader.finish = Bookmark.close
  
  reader.process = function(postData) {
    var self = this;
    Bookmark.store(user, postData, function(bookmark) {
      sys.puts("Stored " + bookmark.title)
      reader.read()
    })
  }

  Bookmark.open(function() {
    reader.read()
  })
})
