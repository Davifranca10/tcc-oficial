const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
/* Upload de Imagem */
const multer = require("multer");
const path = require("path");

// Configuração do Multer para upload de imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

/* Inicialização do App */
const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

const SECRET_KEY = "chave_secreta";
let pool;

/* Criação do Banco e Tabelas */
const initDb = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS auth_demo`);
  await connection.query(`USE auth_demo`);

  // Tabela users
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      telefone VARCHAR(15) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NOT NULL
    )
  `);

  // Tabela funcionarios
  await connection.query(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      especialidade VARCHAR(100),
      telefone VARCHAR(20),
      email VARCHAR(100) UNIQUE
    )
  `);

  // Tabela servicos
  await connection.query(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      descricao TEXT,
      preco DECIMAL(10, 2) NOT NULL,
      duracao INT,
      id_funcionario INT,
      imagem_path VARCHAR(255),
      FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id)
    )`);

  // Tabela agendamentos
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

  console.log("Database e tabelas estão prontas.");
  await connection.end();
};

/* Função principal para iniciar servidor */
const startServer = async () => {
  await initDb();

  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "auth_demo"
  });



  //USUARIOS/CLIENTES

  //cadastro de cliente/usuario
  app.post("/register", async (req, res) => {
    const { name, email, telefone, password } = req.body;
    try {
      const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existing.length > 0) return res.status(400).json({ message: "Usuário já existe" });
      const passwordHash = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (name, telefone, email, passwordHash) VALUES (?, ?, ?, ?)",
        [name, telefone, email, passwordHash]
      );
      res.status(201).json({ message: "Usuário registrado com sucesso" });
    } catch (err) {
      console.error("Erro no /register:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  //login de usuarios
  app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verifica se é o administrador
    if (email === "admin@admin" && password === "admin") {
      const token = jwt.sign({ email, role: "admin" }, SECRET_KEY, { expiresIn: "1h" });
      return res.json({ token, role: "admin" });
    }

    // Verifica se é um usuário comum
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: "Credenciais inválidas" });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(400).json({ message: "Credenciais inválidas" });

    const token = jwt.sign({ email: user.email, name: user.name, id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    // 👇 ADICIONA O ID na resposta
    res.json({
      token,
      role: "user",
      id: user.id, // ← aqui está o segredo
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("Erro no /login:", err.message);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

  //get de usuarios
  app.get("/clients", async (req, res) => {
    try {
      const [users] = await pool.query("SELECT id, name, telefone, email FROM users");
      res.json(users);
    } catch (err) {
      console.error("Erro ao listar usuários:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  //editar de usuarios
  app.put("/clients/:id", async (req, res) => {
    const { id } = req.params;
    const { name, telefone, email, password } = req.body;
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        "UPDATE users SET name = ?, telefone = ?, email = ?, passwordHash = ? WHERE id = ?",
        [name, telefone, email, passwordHash, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado" });
      res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  //deletar de usuarios
  app.delete("/clients/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado" });
      res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });



  //SERVIÇOS

  // Listar todos os serviços com nome do funcionário responsável
  app.get("/servicos", async (req, res) => {
    try {
      const [rows] = await pool.query(`
      SELECT s.*, f.nome AS nome_funcionario 
      FROM servicos s
      LEFT JOIN funcionarios f ON s.id_funcionario = f.id
    `);
      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar serviços:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  // Cadastrar serviço
  app.post("/servicos", upload.single("imagem"), async (req, res) => {
    const { nome, descricao, preco, duracao, id_funcionario } = req.body;
    const imagem_path = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nome || !preco || !duracao || !id_funcionario) {
      return res.status(400).json({
        message: "Campos obrigatórios: nome, preco, duracao e id_funcionario."
      });
    }

    try {
      await pool.query(
        "INSERT INTO servicos (nome, descricao, preco, duracao, id_funcionario, imagem_path) VALUES (?, ?, ?, ?, ?, ?)",
        [nome, descricao || "", preco, duracao, id_funcionario || null, imagem_path]
      );
      res.status(201).json({ message: "Serviço cadastrado com sucesso", imagem: imagem_path });
    } catch (err) {
      console.error("Erro ao cadastrar serviço:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  // Editar serviço
  app.put("/servicos/:id", upload.single("imagem"), async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, duracao, id_funcionario } = req.body;
    let imagem_path = req.body.imagem_path;
    if (req.file) {
      imagem_path = `/uploads/${req.file.filename}`;
    }

    if (!nome || !preco || !duracao || !id_funcionario) {
      return res.status(400).json({
        message: "Campos obrigatórios: nome, preco, duracao e id_funcionario."
      });
    }

    try {
      const [result] = await pool.query(
        "UPDATE servicos SET nome = ?, descricao = ?, preco = ?, duracao = ?, id_funcionario = ?, imagem_path = ? WHERE id = ?",
        [nome, descricao || "", preco, duracao, id_funcionario, imagem_path, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      res.json({ message: "Serviço atualizado com sucesso!" });
    } catch (err) {
      console.error("Erro ao atualizar serviço:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  /* Rotas de Agendamentos */
  app.get("/agendamentos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, s.nome AS servico_nome, f.nome AS funcionario_nome, u.name AS cliente_nome
      FROM agendamentos a
      LEFT JOIN servicos s ON a.id_servico = s.id
      LEFT JOIN funcionarios f ON a.id_funcionario = f.id
      LEFT JOIN users u ON a.id_cliente = u.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err.message);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

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
      console.error("Erro ao criar agendamento:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });



  //FUNCIONARIOS

  //cadastro de funcionarios
  app.post("/funcionarios", async (req, res) => {
    const { nome, especialidade, telefone, email} = req.body;
  
    if (!nome || !telefone || !email) {
      return res.status(400).json({ message: "Campos obrigatórios: nome, telefone, email" });
    }
  
    try {
      const [existing] = await pool.query("SELECT * FROM funcionarios WHERE email = ?", [email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: "Funcionário já existe" });
      }
  
      await pool.query(
        "INSERT INTO funcionarios (nome, especialidade, telefone, email) VALUES (?, ?, ?, ?)",
        [nome, especialidade || "", telefone, email]
      );
  
      res.status(201).json({ message: "Funcionário cadastrado com sucesso" });
    } catch (err) {
      console.error("Erro ao cadastrar funcionário:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });  
  
  //get de funcionarios
  app.get("/funcionarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nome, especialidade, telefone, email FROM funcionarios");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar funcionários:", err.message);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

//editar de funcionarios
app.put("/funcionarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, especialidade, telefone, email } = req.body;

  try {

    const [result] = await pool.query(
      "UPDATE funcionarios SET nome = ?, especialidade = ?, telefone = ?, email = ? WHERE id = ?",
      [nome, especialidade || "", telefone, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    res.status(200).json({ message: "Funcionário atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar funcionário:", err.message);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

//excluir de funcionarios
app.delete("/funcionarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM funcionarios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    res.status(200).json({ message: "Funcionário deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar funcionário:", err.message);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});



//AGENDAMENTO

//get generico do agendamento
app.get("/agendamentos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id, 
        a.data, 
        a.horario, 
        a.status,
        u.name AS cliente_nome,
        s.nome AS servico_nome,
        f.nome AS funcionario_nome
      FROM agendamentos a
      LEFT JOIN users u ON a.id_cliente = u.id
      LEFT JOIN servicos s ON a.id_servico = s.id
      LEFT JOIN funcionarios f ON a.id_funcionario = f.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err.message);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

//get especifico de agendamento
app.get("/agendamentos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM agendamentos WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Erro ao buscar agendamento:", err.message);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
});

//Cadastro de agendamento
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
        console.error("Erro ao criar agendamento:", err.message);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
});

//Editar agendamento
app.put("/agendamentos/:id", async (req, res) => {
  const { id } = req.params;
  const { id_cliente, id_servico, id_funcionario, data, horario, status } = req.body;

  try {
    // Buscar agendamento atual para pegar valores que não foram enviados na atualização
    const [rows] = await pool.query("SELECT * FROM agendamentos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    const agendamentoAtual = rows[0];

    // Atualizar com valores enviados ou manter os atuais
    const novoIdCliente = id_cliente ?? agendamentoAtual.id_cliente;
    const novoIdServico = id_servico ?? agendamentoAtual.id_servico;
    const novoIdFuncionario = id_funcionario ?? agendamentoAtual.id_funcionario;
    const novaData = data ?? agendamentoAtual.data;
    const novoHorario = horario ?? agendamentoAtual.horario;
    const novoStatus = status ?? agendamentoAtual.status;

    const [result] = await pool.query(
      `UPDATE agendamentos 
       SET id_cliente = ?, id_servico = ?, id_funcionario = ?, data = ?, horario = ?, status = ?
       WHERE id = ?`,
      [novoIdCliente, novoIdServico, novoIdFuncionario, novaData, novoHorario, novoStatus, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    res.json({ message: "Agendamento atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err.message);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

//excluir agendamento
app.delete("/agendamentos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM agendamentos WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }
        res.status(200).json({ message: "Agendamento deletado com sucesso" });
    } catch (err) {
        console.error("Erro ao deletar agendamento:", err.message);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
});

app.patch("/agendamentos/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE agendamentos SET status = ? WHERE id = ?",
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    res.json({ message: "Status atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar status:", err.message);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

  /* Rota de Disponibilidade */
  app.post("/disponibilidade", async (req, res) => {
    const { data, id_servico } = req.body;
    try {
      const duracaoServico = await getDuracaoServico(id_servico);
      const agendamentos = await getAgendamentosPorDia(data);
      const horariosPossiveis = gerarHorariosValidos(duracaoServico, agendamentos);
      res.json(horariosPossiveis);
    } catch (err) {
      console.error("Erro na rota de disponibilidade:", err.message);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  async function getDuracaoServico(id_servico) {
    const [rows] = await pool.query("SELECT duracao FROM servicos WHERE id = ?", [id_servico]);
    if (rows.length === 0) throw new Error("Serviço não encontrado");
    return rows[0].duracao;
  }

  async function getAgendamentosPorDia(data) {
    const [rows] = await pool.query("SELECT horario, id_servico FROM agendamentos WHERE data = ?", [data]);
    return rows;
  }

  function gerarHorariosValidos(duracao, agendamentos) {
    const horaInicio = 8;
    const horaFim = 18;
    const ocupados = agendamentos.map(a => a.horario.slice(0, 5)); // ex: "14:00"

    const horariosDisponiveis = [];
    for (let h = horaInicio; h < horaFim; h++) {
      for (let m = 0; m < 60; m += duracao) {
        const inicio = new Date(0, 0, 0, h, m);
        const fim = new Date(inicio.getTime() + duracao * 60000); // duração em ms
        const horaFimDecimal = fim.getHours() + fim.getMinutes() / 60;
        if (horaFimDecimal > horaFim) continue;

        const hora = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        if (!ocupados.includes(hora)) {
          horariosDisponiveis.push(hora);
        }
      }
    }
    return horariosDisponiveis;
  }

  /* Middleware Global de Erro */
  app.use((err, req, res, next) => {
    console.error("Middleware de erro global:", err.message);
    res.status(500).json({ error: "Erro interno no servidor", details: err.message });
  });

  /* Iniciar servidor */
  app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
  });
};

startServer();