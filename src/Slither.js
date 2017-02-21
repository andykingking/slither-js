// @flow

import process from 'process';

import TestFailError from './TestFailError';
import TestPass from './TestPass';
import emoji from './emoji';
import { logTask, logSubTask } from './logging';

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

const start = (testName: string) => {
  logTask(emoji.plane, `Running test: ${testName}`);
};

export const pass = () => {
  throw new TestPass();
};

export const fail = (reason: string) => {
  throw new TestFailError(reason);
};

const runSetup = (setup: Callback[]) => {
  if (setup.length > 0) logTask(emoji.bunny, 'Setting up...');
  setup.forEach(({ name, fn, skip }: Callback) => {
    if (skip) logSubTask(`[SKIPPED] ${name}`);
    else {
      logSubTask(name);
      try {
        fn();
      } catch (error) {
        logSubTask(`ERROR: ${emoji.snek}  ${error.message}`);
      }
    }
  });
};

const runTest = ({ name, fn, skip }: Callback): TestResult => {
  if (skip) start(`[SKIPPED] ${name}`);
  else start(name);
  try {
    if (!skip) {
      fn();
      logSubTask(`ERROR: ${emoji.snek}  ${NoPassOrFailCalled}`);
      return { name, pass: false, reason: NoPassOrFailCalled };
    }
    return { name, pass: true, reason: TestSkipped };
  } catch (error) {
    if (error instanceof TestPass) {
      logSubTask('Test passed.');
      return { name, pass: true };
    }
    logSubTask(`ERROR: ${emoji.snek}  ${error.message}`);
    return { name, pass: false, reason: error.message };
  }
};

const runTeardown = (teardown: Callback[]) => {
  if (teardown.length > 0) logTask(emoji.clean, 'Cleaning up...');
  teardown.forEach(({ name, fn, skip }: Callback) => {
    if (skip) logSubTask(`[SKIPPED] ${name}`);
    else {
      logSubTask(name);
      try {
        fn();
      } catch (error) {
        logSubTask(`ERROR: ${emoji.snek}  ${error.message}`);
      }
    }
  });
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
    runSetup(setup);
    const results = tests.map(runTest);
    runTeardown(teardown);
    if (results.find(hasFailure)) testsFailed();
    else testsPassed();
  },
};
