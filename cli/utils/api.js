const { API_FETCH } = require("../GLOBALS");
const { Problem } = require("../models/Problem");

export const fetchProblem =
  /**
   *
   * @param {string} forid
   * @returns {Problem}
   */
  async (forid) => {
    try {
      const problem = await fetch(API_FETCH.replace("%PROBLEM_ID%", forid));
      const problem_json = await problem.json();
      return new Problem(problem_json);
    } catch (error) {
      return new Problem({ err: error });
    }
  };
