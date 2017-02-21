# slither-js [![Build Status](https://travis-ci.org/andykingking/slither-js.svg?branch=master)](https://travis-ci.org/andykingking/slither-js)
## Usage

```javascript
import Slither, { pass, fail } from 'slither-js';

Slither.setup('Setting things up', () => {
  // Do some setup stuff
});

Slither.test('Testing things', () => {
  // Call pass() or fail()
});

Slither.teardown('Clean stuff up', () => {
  // Undo the setup
});

Slither.run();
```
