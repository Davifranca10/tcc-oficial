

/*
OBS: trocar password e user hardcoded por variáveis de ambiente
*/

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "chave_secreta";

const initDb = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",      
    password: "root"       
  });

  // Create database if not exists
  await connection.query(`CREATE DATABASE IF NOT EXISTS auth_demo`);

  // Use the new DB
  await connection.query(`USE auth_demo`);

  // Create users table if not exists
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NOT NULL
    )
  `);

  console.log("Database and table are ready");

  await connection.end();
};

let pool;
const startServer = async () => {
  await initDb();

  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "auth_demo"
  });

  // Register
  app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await pool.query("INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)", [name, email, passwordHash]);

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      const user = rows[0];

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
  });
};

startServer();
