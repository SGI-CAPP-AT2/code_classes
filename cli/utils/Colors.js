import chalk from "chalk";

export const Colors = {
  NONE: -1,
  GREEN: 0,
  RED: 1,
  YELLOW: 2,
};
export const ChalkWrite = {
  [Colors.GREEN]: (message) => chalk.green(message),
  [Colors.RED]: (message) => chalk.red(message),
  [Colors.YELLOW]: (message) => chalk.yellow(message),
  [Colors.NONE]: (message) => message,
};
