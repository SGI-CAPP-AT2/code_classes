const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const crypto = require("crypto");

function hash(obj) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

async function openDBProblems(filename = ":memory:") {
  const db = await open({
    filename,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS problems (
      id TEXT PRIMARY KEY,
      question TEXT,
      tests TEXT,
      boiler TEXT
    )
  `);

  return {
    async add(problem) {
      const id = hash({
        question: problem.question,
        tests: problem.tests,
        boiler: problem.boiler,
      });
      if (await this.get(id)) return id;
      await db.run(
        `INSERT INTO problems (id, question, tests, boiler) VALUES (?, ?, ?, ?)`,
        id,
        problem.question,
        problem.tests,
        problem.boiler
      );
      return id;
    },

    async get(id) {
      return await db.get(`SELECT * FROM problems WHERE id = ?`, id);
    },

    async getSolutions(id) {
      return await db.all(`SELECT * FROM solutions WHERE problem = ?`, id);
    },

    async delete(id) {
      await db.run(`DELETE FROM problems WHERE id = ?`, id);
    },

    async close() {
      await db.close();
    },
  };
}

async function openDBSolutions(filename = ":memory:") {
  const db = await open({
    filename,
    driver: sqlite3.Database,
  });

  await db.exec(`
      CREATE TABLE IF NOT EXISTS solutions (
        id TEXT PRIMARY KEY,
        code TEXT,
        problem TEXT,
        author TEXT,
        FOREIGN KEY (problem) REFERENCES problems(id) ON DELETE CASCADE
      )
    `);

  return {
    async add(solution) {
      const id = hash({
        code: solution.code,
        problem: solution.problem,
        author: solution.author,
      });
      if (await this.get(id)) return id;
      await db.run(
        `INSERT INTO solutions (id, code, problem, author) VALUES (?, ?, ?, ?)`,
        id,
        solution.code,
        solution.problem,
        solution.author
      );
      return id;
    },

    async get(id) {
      return await db.get(`SELECT * FROM solutions WHERE id = ?`, id);
    },

    async delete(id) {
      await db.run(`DELETE FROM solutions WHERE id = ?`, id);
    },

    async close() {
      await db.close();
    },
  };
}

module.exports = { openDBProblems, openDBSolutions };
