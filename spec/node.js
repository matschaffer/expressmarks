require(__dirname + '/../paths');
require.paths.unshift('spec', 'spec/support', './spec/lib');
require('jspec');

var sys = require('sys');

JSpec
  .exec('spec/unit/handlers.spec.js')
  .exec('spec/unit/spec.bookmark.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report();
