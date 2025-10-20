const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",           // change if different
  password: "your_password",
  database: "animal_welfare" // change if different
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});


// ================= SIGNUP =================
app.post("/api/signup", (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.json({ success: false, message: "Missing fields" });
  }

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.json({ success: false, message: "User already exists" });
        }
        return res.json({ success: false, message: "DB error" });
      }
      res.json({ success: true, message: "Signup successful" });
    }
  );
});


// ================= LOGIN =================
app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Missing fields" });
  }

  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) return res.json({ success: false, message: "DB error" });

    if (results.length === 0) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Optional: check role if you add it in DB
    res.json({ success: true, message: "Login successful", role });
  });
});


// ================= START SERVER =================
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
