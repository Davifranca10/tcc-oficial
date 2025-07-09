document.addEventListener("DOMContentLoaded", async () => {
  const inputEmail = document.getElementById("emailCliente");
  const inputFuncionario = document.getElementById("nomeFuncionario");
  const inputServico = document.getElementById("nomeServico");
  const dataListFuncionarios = document.getElementById("funcionariosList");
  const dataListServicos = document.getElementById("servicosList");
  const dataInput = document.getElementById("dataAgendamento");
  const horarioSelect = document.getElementById("horarioAgendamento");
  const form = document.getElementById("formAgendamento");

  let funcionarios = [];
  let servicos = [];

  // Obter ID da URL
  const params = new URLSearchParams(window.location.search);
  const idAgendamento = params.get("id");

  if (!idAgendamento) {
    alert("ID do agendamento não informado.");
    window.history.back();
    return;
  }

  // Carregar funcionários
  fetch("http://localhost:3000/funcionarios")
    .then(res => res.json())
    .then(dados => {
      funcionarios = dados;
      dados.forEach(f => {
        const option = document.createElement("option");
        option.value = f.nome;
        dataListFuncionarios.appendChild(option);
      });
    });

  // Carregar serviços
  fetch("http://localhost:3000/servicos")
    .then(res => res.json())
    .then(dados => {
      servicos = dados;
      dados.forEach(s => {
        const option = document.createElement("option");
        option.value = s.nome;
        dataListServicos.appendChild(option);
      });
    });

  // Preencher horários comerciais (exemplo: 09:00 - 18:00)
  function preencherHorarios() {
    horarioSelect.innerHTML = "";
    for (let h = 9; h <= 17; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hora = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        horarioSelect.appendChild(option);
      }
    }
  }

  preencherHorarios();

  // Carregar dados do agendamento
  fetch(`http://localhost:3000/agendamentos/${idAgendamento}`)
    .then(res => res.json())
    .then(agendamento => {
      if (!agendamento) {
        alert("Agendamento não encontrado.");
        window.history.back();
        return;
      }

      // Pegar dados do cliente
      fetch(`http://localhost:3000/clients/${agendamento.id_cliente}`)
        .then(res => res.json())
        .then(cliente => {
          inputEmail.value = cliente.email;
        });

      // Pegar dados do funcionário
      fetch(`http://localhost:3000/funcionarios/${agendamento.id_funcionario}`)
        .then(res => res.json())
        .then(funcionario => {
          inputFuncionario.value = funcionario.nome;
        });

      // Pegar dados do serviço
      fetch(`http://localhost:3000/servicos/${agendamento.id_servico}`)
        .then(res => res.json())
        .then(servico => {
          inputServico.value = servico.nome;
        });

      // Preencher campos
      dataInput.value = agendamento.data.split("T")[0];
      horarioSelect.value = agendamento.horario.slice(0, 5); // ex: 14:00
    });

  // Submit do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeFuncionario = inputFuncionario.value.trim();
    const nomeServico = inputServico.value.trim();
    const data = dataInput.value;
    const horario = horarioSelect.value;

    // Buscar ID do funcionário pelo nome
    const funcionario = funcionarios.find(f => f.nome.toLowerCase() === nomeFuncionario.toLowerCase());
    if (!funcionario) {
      alert("Funcionário não encontrado!");
      return;
    }
    const id_funcionario = funcionario.id;

    // Buscar ID do serviço pelo nome
    const servico = servicos.find(s => s.nome.toLowerCase() === nomeServico.toLowerCase());
    if (!servico) {
      alert("Serviço não encontrado!");
      return;
    }
    const id_servico = servico.id;

    // Enviar dados para API
    const response = await fetch(`http://localhost:3000/agendamentos/${idAgendamento}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_funcionario,
        id_servico,
        data,
        horario
      })
    });

    if (response.ok) {
      alert("Agendamento atualizado com sucesso!");
      window.location.href = "../listagem/index.html";
    } else {
      alert("Erro ao atualizar agendamento.");
    }
  });

  /* MENU HAMBÚRGUER */
  const menuBtn = document.getElementById("menuBtn");
  const navBackground = document.getElementById("navBackground");
  let showMenu = false;

  menuBtn.addEventListener("click", () => {
    showMenu = !showMenu;
    menuBtn.classList.toggle("close", showMenu);
    navBackground.classList.toggle("show", showMenu);
    navBackground.style.transitionDelay = showMenu ? "0s" : "0.25s";
    navBackground.childNodes.forEach((el) => {
      if (el.nodeType === 1) {
        el.style.transitionDelay = showMenu ? "0.25s" : "0s";
      }
    });
  });
});
/* MENU HAMBÚRGUER */
const menuBtn = document.getElementById("menuBtn");
const navBackground = document.getElementById("navBackground");
let showMenu = false;

if (menuBtn && navBackground) {
  menuBtn.addEventListener("click", () => {
    showMenu = !showMenu;
    // Toggle class
    menuBtn.classList.toggle("close", showMenu);
    navBackground.classList.toggle("show", showMenu);

    // Manage transition delays
    navBackground.style.transitionDelay = showMenu ? "0s" : "0.25s";
    navBackground.childNodes.forEach((el) => {
      if (el.nodeType === 1) {
        el.style.transitionDelay = showMenu ? "0.25s" : "0s";
      }
    });
  });
} else {
  console.warn("Elementos do menu hambúrguer não encontrados.");
}