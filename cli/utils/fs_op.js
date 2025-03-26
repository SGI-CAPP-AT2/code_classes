import { ASSETS_DIR } from "../GLOBALS.js";
import path from "path";
import { Problem } from "../models/Problem.js";
import fs from "fs";
import { Solution } from "../models/Solution.js";

export const saveProblem =
  /**
   * @param {Problem} prob
   */
  async (prob, dir) => {
    fs.writeFileSync(path.join(dir, "Question.txt"), prob.question);
    fs.writeFileSync(path.join(dir, "Solution.java"), prob.boiler);
    fs.writeFileSync(path.join(dir, "tests"), prob.tests);
  };

export const compressProblem =
  /**
   * @return {Problem} prob
   */
  (dir) => {
    const prob = new Problem({ err: false });
    prob.question = fs.readFileSync(path.join(dir, "Question.txt")).toString();
    prob.boiler = fs.readFileSync(path.join(dir, "Solution.java")).toString();
    prob.tests = fs.readFileSync(path.join(dir, "tests")).toString();
    return prob;
  };

export const compressSolution =
  /**
   * @return {Solution} sol
   */
  (dir) => {
    const solu = new Solution({ err: false });
    solu.problem = fs.readFileSync(path.join(dir, "id")).toString();
    solu.code = fs.readFileSync(path.join(dir, "Solution.java")).toString();
    return solu;
  };
export const initProblem = async (dir) => {
  fs.writeFileSync(path.join(dir, "Question.txt"), "");
  fs.writeFileSync(
    path.join(dir, "Solution.java"),
    fs.readFileSync(path.join(ASSETS_DIR, "Solution.java"))
  );
  fs.writeFileSync(path.join(dir, "tests"), "");
};

export const discardProblem = async (dir) => {
  fs.rmSync(path.join(dir, "Question.txt"));
  fs.rmSync(path.join(dir, "Solution.java"));
  fs.rmSync(path.join(dir, "tests"));
};
