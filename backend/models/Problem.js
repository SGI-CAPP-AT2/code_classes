class Problem {
  /**
   * Class which represents User
   * @param {{ id : Number, question : string, tests: Array<string>, boiler : string, err:boolean}} object
   */
  constructor({ id, question, tests, boiler, err = false }) {
    this.id = id;
    this.question = question;
    this.tests = tests;
    this.boiler = boiler;
    this.err = err;
  }
}
module.exports = { Problem };
