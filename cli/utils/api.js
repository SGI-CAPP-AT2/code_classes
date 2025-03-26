import { API_ADD_PROB, API_ADD_SOL, API_FETCH } from "../GLOBALS.js";
import prob from "../../backend/models/Problem.js";

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
      if (problem.ok == false)
        return new prob.Problem({ err: problem_json.error });
      return new prob.Problem(problem_json);
    } catch (error) {
      return new prob.Problem({ err: error });
    }
  };
export const postProblem = async (prob) => {
  try {
    const res = await fetch(API_ADD_PROB, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Add this line
      body: JSON.stringify(prob),
    });
    const { id } = await res.json();
    return id;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
export const postSolution = async (prob) => {
  try {
    const res = await fetch(API_ADD_SOL, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Add this line
      body: JSON.stringify(prob),
    });
    const { id } = await res.json();
    return id;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
