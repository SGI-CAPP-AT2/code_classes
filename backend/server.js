const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const cors = require("cors");
const { Problem } = require("./models/Problem");
const { openDBProblems, openDBSolutions } = require("./db");
const { Solution } = require("./models/Solution");
const { fetchUser } = require("./utils/user");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3001";

app.use(cors());
app.use(express.json());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = req.user.accessToken;
    res.redirect(`${CLIENT_URL}/auth-success?token=${token}`);
  }
);

app.get("/protected", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  res.json({ message: "Authenticated successfully!", token });
});

app.get("/image", async (req, res) => {
  const url = req.query.url;

  const image = await fetch(url);
  console.log(image.status);
  if (image.status === 200) {
    res.setHeader("Content-Type", image.headers.get("Content-Type"));
    const imageToSend = await image.body.getReader().read();
    res.send(imageToSend);
  }
});

app.post("/add/problem", async (req, res) => {
  const { question, tests, boiler } = req.body;
  console.log(req.body);
  const problem = new Problem({ question, tests, boiler });
  console.log(problem);
  const db = await openDBProblems("problems.db");
  const id = await db.add(problem);
  console.log(id);
  res.json({ id });
});

app.post("/add/solution", async (req, res) => {
  const { problem, code, token } = req.body;
  const pdb = await openDBProblems("problems.db");
  const prob = await pdb.get(problem);
  console.log(prob);
  if (!prob)
    return res.status(404).json({
      error:
        "Check your problem may be it's deleted, I cant create problems by myself.",
    });
  const solution = new Solution({ problem, code });
  const user = await fetchUser(token);
  solution.author = user.email;
  const db = await openDBSolutions("problems.db");
  const id = await db.add(solution);
  res.json({ id });
});

app.get("/fetch/problems/:id", async (req, res) => {
  const id = req.params.id;
  const db = await openDBProblems("problems.db");
  const problem = await db.get(id);
  console.log(problem);
  if (!problem)
    return res
      .status(404)
      .json({ error: "Check your id, I cant create problems by myself." });
  res.json(problem);
});

app.get("/fetch/solutions/:id", async (req, res) => {
  const id = req.params.id;
  const db = await openDBProblems("problems.db");
  const problem = await db.get(id);
  const solutions = await db.getSolutions(id);
  if (!problem)
    return res
      .status(404)
      .json({ error: "Check your id, I cant create problems by myself." });
  res.json(solutions);
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
