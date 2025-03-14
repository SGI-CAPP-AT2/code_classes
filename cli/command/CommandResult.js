import { rollback_init } from "../setup/init.js";
import { Colors } from "../utils/Colors.js";
import { writeOutput } from "../utils/command_outputs.js";
import { loaderAnimation } from "../utils/loadingSpinner.js";

export class CommandResult {
  /**
   * This is super class of all command results.
   * @param {boolean} status
   * @param {String} message
   * @param {{ warning:String }} obj
   */
  constructor(status, message, { warning } = {}) {
    this.status = status;
    this.message = message;
    this.warning = warning;
    this.color = Colors.NONE;
    this.pending = false;
  }
  printed() {}
}
export class FailedCommandResult extends CommandResult {
  /**
   * This represents failed command result.
   * @param {String} message
   */
  constructor(message, obj) {
    super(1, message, obj);
    this.color = Colors.RED;
  }
}
export class SuccessCommandResult extends CommandResult {
  /**
   * This represents successful command result.
   * @param {String} message
   * @param {{warning:String}} obj
   */
  constructor(message, obj) {
    super(0, message, obj);
    this.color = Colors.GREEN;
  }
}
export class PendingCommandResult extends CommandResult {
  /**
   * This represents pending commands
   * @param {{
   *          warning:String,
   *          onCompleteTask:Function
   *          command: string
   *        }} obj
   */
  constructor(message, { warning, onCompleteTask, onFailTask, command }) {
    super(1, message);
    this.___onCompleteTask = onCompleteTask;
    this.___onFailTask = onFailTask;
    this.warning = warning;
    this.color = Colors.YELLOW;
    this.pending = true;
    this.textForLoaderAnimation = () => {
      return "Loading...";
    };
    this.command = command;
  }

  complete(val) {
    this.color = Colors.GREEN;
    this.status = 1;
    this.message = this.___onCompleteTask(val);
    process.stdout.write("\r" + writeOutput(this));
    process.exit(0);
  }

  fail(val) {
    this.color = Colors.RED;
    this.status = 0;
    this.message = this.___onFailTask(val);
    process.stdout.write("\r" + writeOutput(this));
    rollback_init(this.command);
    process.exit(1);
  }

  printed() {
    loaderAnimation({ text: this.textForLoaderAnimation });
  }
}
