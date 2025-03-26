const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const cors = require("cors");
const hash = require("object-hash");
const { Problem } = require("./models/Problem");
const { openDBProblems } = require("./db");

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

app.get("/add/problem", async (req, res) => {
  const { question, tests, boiler } = req.body;
  const problem = new Problem(question, tests, boiler);
  const db = await openDBProblems();
  const id = db.add(problem);
  res.json({ id });
});

app.get("/fetch/problems/:id", async (req, res) => {
  const id = req.params.id;
  const db = await openDBProblems();
  const problem = db.get(id);
  res.json(problem);
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
