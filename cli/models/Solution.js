export class Solution {
  /**
   * Class which represents User
   * @param {{ id : Number, problem : string, code : string, err:boolean}} object
   */
  constructor({ id, problem, code, token, err = false }) {
    this.id = id;
    this.problem = problem;
    this.code = code;
    this.token = token;
    this.err = err;
  }
}
