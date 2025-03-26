import {
  API_ADD_PROB,
  API_ADD_SOL,
  API_FETCH,
  API_GET_SOL,
} from "../GLOBALS.js";
import prob from "../../backend/models/Problem.js";
import { getConfig } from "./configs.js";

export const getApiUrl = (pathToResource) => {
  return `${getConfig("SERVER")}${pathToResource}`;
};

export const fetchProblem =
  /**
   *
   * @param {string} forid
   * @returns {Problem}
   */
  async (forid) => {
    try {
      const problem = await fetch(
        getApiUrl(API_FETCH).replace("%PROBLEM_ID%", forid)
      );
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
    const res = await fetch(getApiUrl(API_ADD_PROB), {
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
    const res = await fetch(getApiUrl(API_ADD_SOL), {
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
export const fetchSolutions =
  /**
   *
   * @param {string} forid
   * @returns {Problem}
   */
  async (forid) => {
    try {
      const res = await fetch(
        getApiUrl(API_GET_SOL).replace("%PROBLEM_ID%", forid)
      );
      const solutions = await res.json();
      if (res.ok == false) return { err: solutions.error };
      return solutions;
    } catch (error) {
      return { err: error };
    }
  };
