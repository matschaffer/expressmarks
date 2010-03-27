require.paths.unshift('.', 'spec', 'spec/support', './spec/lib');
require('jspec');

JSpec
  .exec('spec/unit/handlers.spec.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report();
