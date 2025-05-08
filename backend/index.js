

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

  // Create servicos table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      descricao TEXT,
      preco DECIMAL(10, 2) NOT NULL
    )
  `);

  // Create funcionarios table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE,
      telefone VARCHAR(20),
      especialidade VARCHAR(100)
    )
  `);

  // Create agendamentos table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_cliente INT,
      id_servico INT,
      id_funcionario INT,
      data DATE,
      horario TIME,
      status VARCHAR(50),
      FOREIGN KEY (id_cliente) REFERENCES users(id),
      FOREIGN KEY (id_servico) REFERENCES servicos(id),
      FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id)
    )
  `);

  // ✅ Só encerre a conexão aqui
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





// Criar agendamento Davi
app.post("/agendamentos", async (req, res) => {
  const { id_cliente, id_servico, id_funcionario, data, horario } = req.body;

  try {
    const status = "pendente";
    await pool.query(
      "INSERT INTO agendamentos (id_cliente, id_servico, id_funcionario, data, horario, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id_cliente, id_servico, id_funcionario, data, horario, status]
    );

    res.status(201).json({ message: "Agendamento criado com sucesso" });
  } catch (err) {
    console.error("Erro ao criar agendamento:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

//Listar Agendamentos Davi
app.get("/agendamentos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM agendamentos");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});





// List users
app.get("/clients", async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, name, email FROM users");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Edit users
app.put("/clients/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ?, passwordHash = ? WHERE id = ?",
      [name, email, passwordHash, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

//Delete users
app.delete("/clients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});



startServer();
