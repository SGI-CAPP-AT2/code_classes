const path = require("path");
const { Problem } = require("../models/Problem");
const fs = require("fs");
const crypto = require("crypto");

export const saveProblem =
  /**
   * @param {Problem} prob
   */
  async (prob, dir) => {
    fs.writeFileSync(path.join(dir, "Question.txt"), prob.question);
    fs.writeFileSync(path.join(dir, "Solution.java"), prob.boiler);
    prob.tests.forEach((test) => {
      const hash = crypto.createHash("md5").update(test).digest("hex");
      fs.writeFileSync(path.join(dir, "tests", hash + ".java"), test);
    });
  };

export const compressProblem =
  /**
   * @return {Problem} prob
   */
  async (dir) => {
    const prob = new Problem();
    prob.question = fs.readFileSync(path.join(dir, "Question.txt"));
    prob.boiler = fs.writeFileSync(path.join(dir, "Solution.java"));
    prob.tests = readJavaFilesToArray(dir);
  };

const readJavaFilesToArray = (directory) => {
  const javaFileContents = [];

  const processDirectory = (dir) => {
    try {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          processDirectory(filePath); // Recursive call
        } else if (path.extname(file) === ".java") {
          try {
            const fileContent = fs.readFileSync(filePath, "utf8");
            javaFileContents.push(fileContent);
          } catch (readError) {
            console.error(
              `Error reading file ${filePath}: ${readError.message}`
            );
          }
        }
      });
    } catch (dirError) {
      console.error(`Error reading directory ${dir}: ${dirError.message}`);
    }
  };

  processDirectory(directory);
  return javaFileContents;
};
