// @flow

import process from 'process';

import TestFailError from './TestFailError';
import TestPass from './TestPass';
import emoji from './emoji';
import { logTask, logSubTask, logError } from './logging';

const NoPassOrFailCalled = 'No "pass()" or "fail()" called.';
const TestSkipped = 'Test skipped';

type Callback = {
  name: string;
  fn: Function;
  skip?: boolean;
};

type TestResult = {
  name: string;
  pass: boolean;
  reason?: string;
};

const logCallback = ({ name, skip }: Callback) => {
  if (skip) logSubTask(`[SKIPPED] ${name}`);
  else logSubTask(name);
};

const start = ({ name, skip }: Callback) => {
  if (skip) logTask(emoji.plane, `[SKIPPED] Running test: ${name}`);
  else logTask(emoji.plane, `Running test: ${name}`);
};

export const pass = () => {
  throw new TestPass();
};

export const fail = (reason: string) => {
  throw new TestFailError(reason);
};

const runNonTestCallback = (setup: Callback) => {
  logCallback(setup);
  if (!setup.skip) {
    try {
      setup.fn();
    } catch (error) {
      logError(error.message);
    }
  }
};

const runAllSetup = (setup: Callback[]) => {
  if (setup.length > 0) logTask(emoji.bunny, 'Setting up...');
  setup.forEach(runNonTestCallback);
};

const runTest = (test: Callback): TestResult => {
  start(test);
  try {
    if (!test.skip) {
      test.fn();
      logError(NoPassOrFailCalled);
      return { name: test.name, pass: false, reason: NoPassOrFailCalled };
    }
    return { name: test.name, pass: true, reason: TestSkipped };
  } catch (error) {
    if (error instanceof TestPass) {
      logSubTask('Test passed.');
      return { name: test.name, pass: true };
    }
    logError(error.message);
    return { name: test.name, pass: false, reason: error.message };
  }
};

const runAllTeardown = (teardown: Callback[]) => {
  if (teardown.length > 0) logTask(emoji.clean, 'Cleaning up...');
  teardown.forEach(runNonTestCallback);
};

const hasFailure = (testResult: TestResult): boolean => !(testResult.pass);

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
  setup(name: string, fn: Function) {
    setup.push({ name, fn });
  },
  xsetup(name: string, fn: Function) {
    setup.push({ name, fn, skip: true });
  },
  test(name: string, fn: Function) {
    tests.push({ name, fn });
  },
  xtest(name: string, fn: Function) {
    tests.push({ name, fn, skip: true });
  },
  teardown(name: string, fn: Function) {
    teardown.push({ name, fn });
  },
  xteardown(name: string, fn: Function) {
    teardown.push({ name, fn, skip: true });
  },
  run() {
    logTask(emoji.run, 'Starting tests.');
    runAllSetup(setup);
    const results = tests.map(runTest);
    runAllTeardown(teardown);
    if (results.find(hasFailure)) testsFailed();
    else testsPassed();
  },
};
