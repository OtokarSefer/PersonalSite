require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(403).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Welcome to the protected route!" });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "username may already exist." });
      }
      res.json({ message: "User registered!" });
    }
  );
});

app.post("/login", (req, res) => {
  console.log("trying to login");
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) {
      console.log("DB error:", err);
      return res.status(500).json({ error: "Server error" });
    }
    if (results.length === 0) {
      console.log("No user found with username:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    console.log("Found user:", user);
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isValid);

    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
