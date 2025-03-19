import { Token } from "./Token.js";
import { User } from "./User.js";

export class CommandInput {
  /**
   * This is CommandInput class used to
   * @param {{ user:User, args:Array<string>, cwd:string, command:string, token:Token}} param0
   */
  constructor({ user, args, cwd, command, token }) {
    this.user = user;
    this.args = args;
    this.cwd = cwd;
    this.command = command;
    this.token = token;
  }
}
