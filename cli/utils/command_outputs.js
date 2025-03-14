import { CommandResult } from "../command/CommandResult.js";
import { ChalkWrite } from "./Colors.js";

/**
 *
 * @param {CommandResult} resultObject
 */
export const writeOutput = (resultObject) =>
  ChalkWrite[resultObject.color](resultObject.message);
