document.getElementById("form-servico").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const duracao = parseInt(document.getElementById("duracao").value);

  try {
    const response = await fetch("http://localhost:3000/servicos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, descricao, preco, duracao })
    });

    const resultado = await response.json();

    if (response.ok) {
      document.getElementById("mensagem").textContent = "Serviço cadastrado com sucesso!";
    } else {
      document.getElementById("mensagem").textContent = resultado.message || "Erro ao cadastrar.";
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    document.getElementById("mensagem").textContent = "Erro de conexão com o servidor.";
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#servico-form');
  const btnAdd = document.querySelector('#btn-add');
  const servicosTable = document.querySelector('#servicos-list tbody');

  let isEditing = false;
  let editId = null;

  async function carregarServicos() {
    const res = await fetch('/api/servicos');
    const servicos = await res.json();

    servicosTable.innerHTML = '';
    servicos.forEach(servico => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${servico.nome}</td>
        <td>${servico.descricao}</td>
        <td>R$ ${parseFloat(servico.preco).toFixed(2)}</td>
        <td>${servico.duracao_em_minutos} min</td>
        <td>
          <button class="edit" data-id="${servico.id}">Editar</button>
          <button class="delete" data-id="${servico.id}">Excluir</button>
        </td>
      `;
      servicosTable.appendChild(tr);
    });
  }

  btnAdd.addEventListener('click', async () => {
    const dados = {
      nome: form.nome.value,
      descricao: form.descricao.value,
      preco: form.preco.value,
      duracao_em_minutos: form.duracao.value
    };

    if (isEditing) {
      await fetch(`/api/servicos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      isEditing = false;
      editId = null;
      btnAdd.textContent = 'Cadastrar Serviço';
    } else {
      await fetch('/api/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }

    form.reset();
    carregarServicos();
  });

  servicosTable.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete')) {
      const id = e.target.dataset.id;
      await fetch(`/api/servicos/${id}`, { method: 'DELETE' });
      carregarServicos();
    }

    if (e.target.classList.contains('edit')) {
      const id = e.target.dataset.id;
      const res = await fetch(`/api/servicos/${id}`);
      const servico = await res.json();

      form.nome.value = servico.nome;
      form.descricao.value = servico.descricao;
      form.preco.value = servico.preco;
      form.duracao.value = servico.duracao_em_minutos;
      btnAdd.textContent = 'Atualizar Serviço';
      isEditing = true;
      editId = id;
    }
  });

  carregarServicos();
});
