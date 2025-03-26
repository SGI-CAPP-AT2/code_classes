import { CommandResult } from "./command/CommandResult.js";
import * as commands from "./command/commands.js";
import { CommandInput } from "./models/CommanInput.js";
import { init, rollback_init } from "./setup/init.js";
import { writeOutput } from "./utils/command_outputs.js";
import { getUserDetailsFromFetch, getUserToken } from "./utils/user_details.js";

export const execute = async (args) => {
  const _command = args[2];
  const _args = args.slice(3);

  // command is available
  if (commands[_command]) {
    init(_command);
    const args = _args;
    const user = await getUserDetailsFromFetch();
    const token = getUserToken();
    const command = _command;
    const cwd = process.cwd();
    /**
     * @type {CommandResult}
     */
    const _res = await commands[_command](
      new CommandInput({
        args,
        user,
        command,
        token,
        cwd,
      })
    );
    console.log(writeOutput(_res));
    if (_res) _res.printed();
    if (_res.pending) return;
    if (!_res.pending && _res.status == 1) rollback_init();
    process.exit(_res.status);
  }
  // command is not available
  else {
    console.error(`Command "${_command}" not found`);
  }
};
