import open from "open";
import {
  AUTH_URL,
  LOGIN_PORT,
  PAGES_LOGIN_SUCESS,
  USER_DETAILS_DIR,
  USER_TOKEN_FILE,
} from "../GLOBALS.js";
import { ServerConfig } from "../server/ServerConfig.js";
import { ServerPath } from "../server/ServerPath.js";
import { startServer } from "../server/start.js";
import {
  CommandResult,
  FailedCommandResult,
  PendingCommandResult,
  SuccessCommandResult,
} from "./CommandResult.js";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { getPage } from "../pages/getPage.js";
import {
  deleteUserDetails,
  getUserDetailsFromCache,
  getUserDetailsFromFetch,
} from "../utils/user_details.js";
import { CommandInput } from "../models/CommanInput.js";
import { fetchProblem, postProblem, postSolution } from "../utils/api.js";
import {
  compressProblem,
  compressSolution,
  discardProblem,
  initProblem,
  saveProblem,
} from "../utils/fs_op.js";
import { runTests } from "../utils/executor.js";

export const hello =
  /**
   * This is simple command used for testing purpose.
   * @returns {CommandResult} Hello World!
   */
  async ({ user }) => {
    const output = `Hello ${!user.err ? user.name : "World"}!`;
    return new SuccessCommandResult(output);
  };

export const login =
  /**
   * this command is used to login the user using google auth provied by firebase.
   * @param {CommandInput} anonymous_0
   * @returns {CommandResult} Logged in successfully!
   */
  async ({ user, command }) => {
    if (!user.err) return new FailedCommandResult("Already Logged In !");
    const pendingRes = new PendingCommandResult(
      "Login is available at " + AUTH_URL,
      {
        onCompleteTask: (val) => {
          return "Logged in successfully with email: " + val.email;
        },
        onFailTask: (val) => {
          return "Unable to login " + val;
        },
        command,
      }
    );
    let timeOutCount = 120;
    setInterval(() => {
      if (timeOutCount-- == 0) pendingRes.fail("Timed Out!               ");
    }, 1000);
    pendingRes.textForLoaderAnimation = () =>
      "Loading..., Will exit in " + timeOutCount + "s ";
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    const listenForTokenAt = new ServerPath(
      "/auth-success",
      /**
       * @param {import("express").Request} req
       * @param {import("express").Response} res
       */
      async (req, res) => {
        const token = req.query.token;
        res.statusCode = 200;
        if (token) res.redirect("/success");
        else res.redirect("/fail");
        return token;
      }
    );
    const listenForSuccessEnd = new ServerPath(
      "/success",
      /**
       * @param {Request} req
       * @param {import("express").Response} res
       */
      async (req, res) => {
        const userDetails = await getUserDetailsFromFetch();
        if (userDetails.err) pendingRes.fail("Unexpected Error Occurred !");
        res.send(getPage(PAGES_LOGIN_SUCESS, userDetails));
        return userDetails;
      }
    );
    const listenForFailEnd = new ServerPath(
      "/fail",
      /**
       * @param {Request} req
       * @param {import("express").Response} res
       */
      async (req, res) => res.send("Failed to login !")
    );
    listenForTokenAt.onCompleteTask((val) => {
      if (!existsSync(USER_DETAILS_DIR)) mkdirSync(USER_DETAILS_DIR);
      writeFileSync(USER_TOKEN_FILE, val);
    });
    listenForSuccessEnd.onCompleteTask((val) => {
      pendingRes.complete(val);
    });
    listenForFailEnd.onCompleteTask(() => pendingRes.fail("Unable to login"));
    const serverConfig = new ServerConfig({
      paths: [listenForTokenAt, listenForFailEnd, listenForSuccessEnd],
      port: LOGIN_PORT,
    });
    startServer(serverConfig);
    open(AUTH_URL);
    return pendingRes;
  };
export const logout =
  /**
   * this command is used to logout the user.
   * @param {CommandInput} anonymous_0
   * @returns {CommandResult} Successfully Logged out !
   */
  async ({ user }) => {
    const failReturn = new FailedCommandResult(
      "Unable to logout ! May be you're not logged in."
    );
    if (user.err) return failReturn;
    const err = await deleteUserDetails();
    return !err
      ? new SuccessCommandResult("Successfully Logged out !")
      : failReturn;
  };
export const fetch =
  /**
   * this command is used to fetch questions
   * @param {CommandInput} anonymous_0
   * @returns {CommandResult}
   */
  async ({ token, args, cwd }) => {
    const failLoginReturn = new FailedCommandResult(
      "Unable to logout ! May be you're not logged in."
    );
    const failArgReturn = new FailedCommandResult(
      "Expected 1 arg, where is id? what should i fetch? btw I dont fetch water for you"
    );
    if (token.err) return failLoginReturn;
    if (!args[0]) return failArgReturn;
    const id = args[0];
    const problem = await fetchProblem(id);
    if (problem.err)
      return new FailedCommandResult("Something went wrong! " + problem.err);
    saveProblem(problem, cwd);
    writeFileSync("id", id);
    return new SuccessCommandResult(
      "Saved Question in this directory Edit Solution file"
    );
  };

export const push =
  /**
   * this command is used to push questions
   * @param {CommandInput} anonymous_0
   * @returns {CommandResult}
   */
  async ({ token, cwd }) => {
    const failLoginReturn = new FailedCommandResult(
      "Unable to logout ! May be you're not logged in."
    );
    if (token.err) return failLoginReturn;
    const prob = compressProblem(cwd);
    const id = await postProblem(prob);
    if (id) {
      writeFileSync("id", id);
      return new SuccessCommandResult(
        "Question pushed with id: " +
          id +
          "\nPlease note this id for future reference or question will be lost"
      );
    }
    return new FailedCommandResult("Unable to push question");
  };

export const add =
  /**
   * this command is used to add questions
   * @param {CommandInput} anonymous_0
   * @returns {CommandResult}
   */
  async ({ cwd }) => {
    initProblem(cwd);
    return new SuccessCommandResult("Problem added in this directory");
  };

export const discard =
  /**
   * this command is used to add questions
   * @param {CommandInput} anonymous_0
   * @returns {CommandResult}
   */
  async ({ cwd }) => {
    discardProblem(cwd);
    return new SuccessCommandResult("Problem discarded from this directory");
  };

export const test =
  /**
   * this command is used to test questions
   * @param {CommandInput} anonymous_0
   * @returns {CommandResult}
   */
  async ({ cwd }) => {
    const result = runTests(cwd);
    if (result.success)
      return new SuccessCommandResult(
        "All tests passed ! You're good coder ig."
      );
    return new FailedCommandResult(
      "Test failed at test case: " +
        result.failedTestIndex +
        "\n" +
        "Input: " +
        result.input +
        "\n" +
        "Expected Output: " +
        result.expectedOutput +
        "\n" +
        "Output: " +
        result.output
    );
  };

export const submit =
  /**
   * this command is used to test questions
   * @param {CommandInput} anonymous_0
   * @returns {CommandResult}
   */
  async ({ cwd, token }) => {
    const result = runTests(cwd);
    if (result.success) {
      const solution = compressSolution(cwd);
      solution.token = token.token;
      const id = await postSolution(solution);
      if (id)
        return new SuccessCommandResult(
          "Solution submitted successfully with id: " + id
        );
      return new FailedCommandResult("Unable to submit solution");
    }
  };
