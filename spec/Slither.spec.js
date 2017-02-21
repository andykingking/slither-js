import Slither, { pass, fail } from '../src/Slither';

let setupHasRun = false;
let testHasRun = false;
let teardownHasRun = false;

Slither.setup('Setup runs before test', () => {
  setupHasRun = true;
});

Slither.test('Test runs after setup', () => {
  testHasRun = true;
  if (!setupHasRun) fail('Test ran before setup');
  if (teardownHasRun) fail('Test ran after teardown');
  pass();
});

Slither.teardown('Teardown runs last', () => {
  teardownHasRun = true;
});

Slither.setup('Second setup runs after first', () => {
  if (!setupHasRun) fail('Second setup ran before first');
});

Slither.test('Second test runs after first', () => {
  if (!testHasRun) fail('Second test ran before first');
  pass();
});

Slither.teardown('Second teardown runs after first', () => {
  if (!teardownHasRun) fail('Second teardown ran before first');
});

Slither.xsetup('Skipped setups do not run', () => {
  fail('Skipped setup ran');
});

Slither.xtest('Skipped tests do not run', () => {
  fail('Skipped test ran');
});

Slither.xteardown('Skipped teardowns do not run', () => {
  fail('Skipped teardown ran');
});


Slither.run();
