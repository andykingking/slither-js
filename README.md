# slither-js [![Build Status](https://travis-ci.org/andykingking/slither-js.svg?branch=master)](https://travis-ci.org/andykingking/slither-js)

🐍🐍🐍  Don't fear the sneks. 🐍🐍🐍

## Motivation

Born from a project where full-featured testing frameworks placed unwanted restrictions on a test.

## Principles

- Test small scripts with small testing frameworks, test large projects with large testing frameworks.
- Failing a setup or teardown function should fail the whole program, but not the test.
- Scoping is the responsibility of the engineer.
- Ordering is the responsibility of the engineer.
- Failing fast means better tests. Proactive testing is better.
- More emoji is better than less emoji.

## Installation

```bash
# NPM
npm install --save-dev slither-js

# YARN
yarn add slither-js --dev
```

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

```bash
$ ./node_modules/.bin/babel-node specFile.js
...
```

See the [project tests](https://github.com/andykingking/slither-js/blob/master/spec/Slither.spec.js) for examples.
