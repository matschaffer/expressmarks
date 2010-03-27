describe("url handlers", function () {
  var handlers, express;

  before(function () {
    handlers = require('handlers');
    express = require('mockExpress');
  });

  it("should render a form on get", function () {
    express.mock.should.receive('render');
    express.route(handlers.get);
  });
});
