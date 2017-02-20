import process from 'process';

function TestFailError(reason) {
  this.name = 'TestFailError';
  this.message = reason;
  this.stack = (new Error()).stack;
}
TestFailError.prototype = Object.create(Error.prototype);
TestFailError.prototype.constructor = TestFailError;

export const emoji = {
  plane: '✈️',
  snek: '🐍',
  bunny: '🐇',
  clean: '🌪',
  run: '🏃🏻',
  ok: '👌🏽',
  nope: '👎🏽',
};

export const logTask = (emojiString, message) => {
  console.log(`  ${emojiString}  ${message}`);
};

export const logSubTask = (message) => {
  console.log(`       ${message}`);
};

export const start = (testName) => {
  logTask(emoji.plane, `Running test: ${testName}`);
};

export const pass = () => {
  logSubTask('Test passed.');
};

export const fail = (reason) => {
  throw new TestFailError(reason);
};

const runSetup = (setup) => {
  if (setup.length > 0) logTask(emoji.bunny, 'Setting up...');
  setup.forEach(({ name, fn, skip }) => {
    if (skip) logSubTask(`[SKIPPED] ${name}`);
    else {
      logSubTask(name);
      fn();
    }
  });
};

const runTest = ({ name, fn, skip }) => {
  if (skip) start(`[SKIPPED] ${name}`);
  else start(name);
  try {
    if (!skip) fn();
    return { name, pass: true };
  } catch (error) {
    logSubTask(`ERROR: ${emoji.snek}  ${error.message}`);
    return { name, pass: false, reason: error.message };
  }
};

const runTeardown = (teardown) => {
  if (teardown.length > 0) logTask(emoji.clean, 'Cleaning up...');
  teardown.forEach(({ name, fn, skip }) => {
    if (skip) logSubTask(`[SKIPPED] ${name}`);
    else {
      logSubTask(name);
      fn();
    }
  });
};

const hasFailure = testResult => !(testResult.pass);

const testsPassed = () => {
  logTask(emoji.ok, 'Tests completed.\n');
};

const testsFailed = () => {
  logTask(emoji.nope, 'Tests failed.\n');
  process.exit(1);
};

const setup = [];
const tests = [];
const teardown = [];

export default {
  setup(name, fn) {
    setup.push({ name, fn });
  },
  xsetup(name, fn) {
    setup.push({ name, fn, skip: true });
  },
  test(name, fn) {
    tests.push({ name, fn });
  },
  xtest(name, fn) {
    tests.push({ name, fn, skip: true });
  },
  teardown(name, fn) {
    teardown.push({ name, fn });
  },
  xteardown(name, fn) {
    teardown.push({ name, fn, skip: true });
  },
  run() {
    logTask(emoji.run, 'Starting tests.');
    runSetup(setup);
    const results = tests.map(runTest);
    runTeardown(teardown);
    if (results.find(hasFailure)) testsFailed();
    else testsPassed();
  },
};
