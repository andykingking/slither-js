// @flow

function TestFailError(reason: string) {
  this.name = 'TestFailError';
  this.message = reason;
  this.stack = (new Error()).stack;
}
TestFailError.prototype = Object.create(Error.prototype);
TestFailError.prototype.constructor = TestFailError;

export default TestFailError;
