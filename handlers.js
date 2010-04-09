var sys = require('sys')
   ,Bookmark = require('bookmark').Bookmark

exports.get = function () {
  this.render("index.haml.html");
};

exports.tags = function (tagPath) {
  var self = this,
      tags = tagPath.split('/')

  Bookmark.findByTags(tags, function(bookmarks) {
    self.render('index.haml.html', { locals: { bookmarks: bookmarks }})
  })
}
