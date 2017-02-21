// @flow

function TestPass() {
  this.name = 'TestPass';
  this.message = 'The test passed successfully';
  this.stack = (new Error()).stack;
}
TestPass.prototype = Object.create(Error.prototype);
TestPass.prototype.constructor = TestPass;

export default TestPass;
