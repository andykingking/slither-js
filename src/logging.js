// @flow

export const logTask = (emojiString: string, message: string) => {
  console.log(`  ${emojiString}  ${message}`);
};

export const logSubTask = (message: string) => {
  console.log(`       ${message}`);
};
