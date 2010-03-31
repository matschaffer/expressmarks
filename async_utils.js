require('ext')

exports.each = function(coll, process, finish) {
  var item, recur = arguments.callee;
  if (!coll || coll.isEmpty) {
    if (finish) finish()
  } else {
    var item = coll.first, ret = process(item, function() {
      recur(coll.drop(1), process, finish);
    });
  }
}