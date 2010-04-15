require("../paths");

var sys      = require("sys")
   ,fs       = require("fs")
   ,async    = require("async_utils")
   ,Redis    = require("redisclient")
   ,dataFile = __dirname + "/../data/schapht.posts.xml"
   ,db       = new Redis.Client();


fs.readFile(dataFile, function(err, data) {
  var reader = {
    process: function() {},
    finish: function() {},
    read: function() {
      match = this.buffer.match(/<post [^>]*>/);
      if (match) {
        str = match[0];
        this.buffer = this.buffer.substr(str.length);
        this.process({ url:   str.match(/href="([^"]*)"/)[1],
                       title: str.match(/description="([^"]*)"/)[1],
                       tags:  str.match(/tag="([^"]*)"/)[1].split(" ") });
      } else {
        this.finish();
      }
    }
  };
  
  reader.buffer = data;
  reader.finish = function() { db.quit(); };
 
  var current_key = 0; 
  reader.process = function(postData) {
    var self = this;
    sys.puts("Storing " + current_key + ": " + postData.tags);
    async.each(postData.tags, function(tag, next) {
      db.sadd(current_key, postData.tags[0], function() {
        sys.puts("stored");
        sys.p(arguments);
        next();
      });
    }, function() {
      reader.read();
    })
  };

  reader.read();
})
