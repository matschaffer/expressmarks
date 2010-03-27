require('vendor/underscore-0.6.0');

var mock = exports.mock = {
  render: function(){}
};

exports.route = function(fn) {
  _.bind(fn, mock)();
};
