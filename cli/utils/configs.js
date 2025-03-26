import fs from "fs";
import path from "path";
import { APP_DIR } from "../GLOBALS.js";
export const getConfig = (config) => {
  const configs = fs.existsSync(path.join(APP_DIR, ".configs"))
    ? JSON.parse(fs.readFileSync(path.join(APP_DIR, ".configs")))
    : {};
  return configs[config];
};
