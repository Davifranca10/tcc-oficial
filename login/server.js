// server.js
import express from 'express';
import path from 'path';
import cors from 'cors';
import db from './db.js';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve a tela inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 📌 Rota para cadastrar cliente
app.post('/clientes', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const [resultado] = await db.execute(
      "INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senha]
    );
    res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!", id_cliente: resultado.insertId });
  } catch (erro) {
    res.status(400).json({ erro: "Erro ao cadastrar cliente", detalhes: erro.message });
  }
});

//  Rota para listar clientes
app.get('/clientes', async (req, res) => {
  try {
    const [clientes] = await db.execute("SELECT id_cliente, nome, email FROM clientes");
    res.json(clientes);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar clientes" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
