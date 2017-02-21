// @flow

import emoji from './emoji';

export const logTask = (emojiString: string, message: string) => {
  console.log(`  ${emojiString}  ${message}`);
};

export const logSubTask = (message: string) => {
  console.log(`       ${message}`);
};

export const logError = (reason: string) => {
  logSubTask(`ERROR: ${emoji.snek}  ${reason}`);
};
