class Solution {
  /**
   * Class which represents User
   * @param {{ id : Number, problem : string, code : string, err:boolean}} object
   */
  constructor({ id, problem, code, author, err = false }) {
    this.id = id;
    this.problem = problem;
    this.code = code;
    this.author = author;
    this.err = err;
  }
}

module.exports = { Solution };
