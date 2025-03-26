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

    async delete(id) {
      await db.run(`DELETE FROM problems WHERE id = ?`, id);
    },

    async close() {
      await db.close();
    },
  };
}

module.exports = { openDBProblems };
