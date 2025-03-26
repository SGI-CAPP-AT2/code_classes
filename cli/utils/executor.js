import { chdir } from "process";

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export function runTests(cwd, backto) {
  const javaFilePath = path.join(cwd, "Solution.java");
  const testsFilePath = path.join(cwd, "tests");
  if (!fs.existsSync(javaFilePath)) {
    throw new Error(`Java file not found: ${javaFilePath}`);
  }
  if (!fs.existsSync(testsFilePath)) {
    throw new Error(`Test cases file not found: ${testsFilePath}`);
  }
  chdir(cwd);
  // Compile Java file
  try {
    execSync(`javac Solution.java`);
  } catch (err) {
    return { success: false, error: "Compilation failed" };
  }

  const tests = parseTestCases(testsFilePath);

  for (let i = 0; i < tests.length; i++) {
    const { dataType, input, expectedOutput } = tests[i];
    let formattedInput = formatInput(input, dataType);
    try {
      console.log(process.cwd());
      let output = execSync(`java Solution ${dataType} "${formattedInput}"`)
        .toString()
        .trim();
      if (output !== expectedOutput.join("\n")) {
        chdir(backto);
        return {
          success: false,
          failedTestIndex: i + 1,
          input: input,
          expectedOutput: expectedOutput,
          output: output,
        };
      }
    } catch (err) {
      chdir(backto);
      return {
        success: false,
        failedTestIndex: i + 1,
        error: "Runtime Error",
        input: input,
        expectedOutput: expectedOutput,
        output: err.stdout.toString(),
      };
    }
  }
  chdir(backto);
  return { success: true };
}

function parseTestCases(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const tests = [];
  let dataType = "";
  let input = [];
  let expectedOutput = [];
  let isParsingInput = false;
  let isParsingOutput = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "testcase") {
      dataType = "";
      input = [];
      expectedOutput = [];
      isParsingInput = false;
      isParsingOutput = false;
    } else if (trimmedLine.startsWith("datatype_")) {
      dataType = trimmedLine.split("_")[1].trim();
    } else if (trimmedLine === "input") {
      isParsingInput = true;
      isParsingOutput = false;
    } else if (trimmedLine === "expected_output") {
      isParsingInput = false;
      isParsingOutput = true;
    } else if (trimmedLine === "testcaseend") {
      tests.push({ dataType, input, expectedOutput });
      isParsingInput = false;
      isParsingOutput = false;
    } else if (isParsingInput) {
      input.push(trimmedLine);
    } else if (isParsingOutput) {
      expectedOutput.push(trimmedLine);
    }
  }
  return tests;
}

function formatInput(input, dataType) {
  switch (dataType) {
    case "int":
    case "double":
    case "float":
    case "boolean":
      return input.join(" ");
    case "String":
      return `"${input.join(" ")}"`;
    case "char":
      return `'${input[0]}'`;
    case "int[]":
      return input.join(" ");
    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }
}

// Example usage
// const result = runTests("Solution.java", "tests.txt");
