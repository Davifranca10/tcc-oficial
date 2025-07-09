document.addEventListener("DOMContentLoaded", () => {
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

  // Carregar funcionários
  fetch("http://localhost:3000/funcionarios")
    .then((res) => res.json())
    .then((dados) => {
      funcionarios = dados;
      dados.forEach((f) => {
        const option = document.createElement("option");
        option.value = f.nome;
        dataListFuncionarios.appendChild(option);
      });
    });

  // Carregar serviços
  fetch("http://localhost:3000/servicos")
    .then((res) => res.json())
    .then((dados) => {
      servicos = dados;
      dados.forEach((s) => {
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

  // Submit do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const nomeFuncionario = inputFuncionario.value.trim();
    const nomeServico = inputServico.value.trim();
    const data = dataInput.value;
    const horario = horarioSelect.value;

    // Buscar ID do cliente pelo email
    const clienteRes = await fetch(`http://localhost:3000/clients?email=${encodeURIComponent(email)}`);
    const clientes = await clienteRes.json();
    if (clientes.length === 0) {
      alert("Cliente não encontrado!");
      return;
    }
    const id_cliente = clientes[0].id;

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
    const response = await fetch("http://localhost:3000/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_cliente,
        id_funcionario,
        id_servico,
        data,
        horario,
        status: "pendente"
      })
    });

    if (response.ok) {
      alert("Agendamento cadastrado com sucesso!");
      form.reset();
    } else {
      alert("Erro ao cadastrar agendamento.");
    }
  });
});