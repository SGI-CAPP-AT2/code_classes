import fs, { rmdirSync } from "fs";
import { APP_DIR, USER_DETAILS_DIR } from "../GLOBALS.js";
export const init = (command) => {
  fs.existsSync(APP_DIR) || fs.mkdirSync(APP_DIR);
  // Initialize for login command
  command === "login" &&
    !fs.existsSync(USER_DETAILS_DIR) &&
    fs.mkdirSync(USER_DETAILS_DIR);
};
export const rollback_init = async (command) => {
  // Initialize for login command
  command === "login" &&
    fs.existsSync(USER_DETAILS_DIR) &&
    rmdirSync(USER_DETAILS_DIR);
};
