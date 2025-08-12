// Variáveis globais 
const selectServico = document.querySelector("select[name='id_servico']");
const previewImagem = document.getElementById("previewImagem");
const nomeFuncionario = document.getElementById("nomeFuncionario");
const idFuncionarioInput = document.getElementById("idFuncionario");
const campoData = document.getElementById("campoData");
const selectHorario = document.getElementById("selectHorario");

// Função para carregar serviços e preencher a combo box
async function carregarServicos() {
  try {
    const response = await fetch("http://localhost:3000/servicos");
    if (!response.ok) throw new Error("Erro ao carregar serviços");

    const servicos = await response.json();

    // Limpa e preenche o select
    selectServico.innerHTML = '<option value="">-- Selecione um serviço --</option>';

    servicos.forEach(servico => {
      const option = document.createElement("option");
      option.value = servico.id;
      option.textContent = `${servico.nome} - R$${parseFloat(servico.preco).toFixed(2)}`;
      option.dataset.imagem = servico.imagem_path ? `http://localhost:3000${servico.imagem_path}` : "";
      option.dataset.funcionarioNome = servico.nome_funcionario || "Não definido";
      option.dataset.funcionarioId = servico.id_funcionario || "";
      selectServico.appendChild(option);
    });

    // Se vier com parâmetro ?servico=...
    const urlParams = new URLSearchParams(window.location.search);
    const servicoNome = urlParams.get("servico");

    if (servicoNome) {
      const decodedName = decodeURIComponent(servicoNome);
      const match = servicos.find(s => s.nome === decodedName);

      if (match) {
        selectServico.value = match.id;
        setTimeout(() => {
          const event = new Event("change");
          selectServico.dispatchEvent(event);
        }, 0);
      }
    }

    // Atualiza imagem e funcionário ao mudar o select
    selectServico.addEventListener("change", () => {
      // Resetar data e horários
      campoData.value = "";
      selectHorario.innerHTML = '<option>Selecione uma data primeiro</option>';
      selectHorario.disabled = true;

      const selectedOption = selectServico.options[selectServico.selectedIndex];
      const imagemPath = selectedOption.dataset.imagem;
      const nomeFunc = selectedOption.dataset.funcionarioNome;
      const idFunc = selectedOption.dataset.funcionarioId;

      previewImagem.src = "https://via.placeholder.com/300x250?text=Carregando...";
      previewImagem.alt = "Carregando imagem...";

      if (imagemPath) {
        const tempImg = new Image();
        tempImg.onload = () => {
          previewImagem.src = imagemPath;
          previewImagem.alt = selectedOption.text;
        };
        tempImg.onerror = () => {
          previewImagem.src = "https://via.placeholder.com/300x250?text=Erro+na+Imagem";
          previewImagem.alt = "Imagem não encontrada";
        };
        tempImg.src = imagemPath;
      } else {
        previewImagem.src = "https://via.placeholder.com/300x250?text=Sem+Imagem";
        previewImagem.alt = "Sem imagem";
      }

      if (nomeFunc) nomeFuncionario.textContent = nomeFunc;
      if (idFunc) idFuncionarioInput.value = idFunc;
    });

  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    selectServico.innerHTML = "<option disabled selected>Erro ao carregar serviços</option>";
    previewImagem.src = "https://via.placeholder.com/300x250?text=Erro+ao+carregar";
    nomeFuncionario.textContent = "-";
    idFuncionarioInput.value = "";
  }
}

// Função para salvar agendamento no banco
async function salvarAgendamento() {
  const form = document.getElementById("form-agendamento");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idServico = selectServico.value;
    const idFuncionario = idFuncionarioInput.value;
    const data = campoData.value;
    const horario = selectHorario.value;
    const idCliente = localStorage.getItem("id_cliente");

    if (!idCliente) {
      alert("Você precisa estar logado para agendar.");
      return;
    }

    const diaSelecionado = new Date(data).getDay();
    if (diaSelecionado === 0 || diaSelecionado === 6) {
      alert("Não é permitido agendar aos finais de semana.");
      return;
    }

    if (!idServico || !idFuncionario || !data || !horario) {
      alert("Preencha todos os campos antes de confirmar.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_cliente: idCliente,
          id_servico: idServico,
          id_funcionario: idFuncionario,
          data,
          horario
        })
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.message || "Erro ao agendar.");
      }

      alert("Agendamento enviado com sucesso! Aguarde a confirmação.");

      // Redireciona para a página principal
      window.location.href = "/frontend/index.html";
    } catch (err) {
      console.error("Erro ao enviar agendamento:", err.message);
      alert(err.message);
    }
  });
}

// Carregar horários disponíveis com base na data e serviço
campoData.addEventListener("input", async function () {
  const dataSelecionada = new Date(this.value);
  const diaSemana = dataSelecionada.getDay();

  // Bloqueia finais de semana
  if (diaSemana === 0 || diaSemana === 6) {
    alert("Não é permitido agendar aos finais de semana.");
    this.value = "";
    selectHorario.innerHTML = '<option>Selecione uma data válida</option>';
    selectHorario.disabled = true;
    return;
  }

  const data = this.value;
  const idServico = selectServico.value;

  if (!data || !idServico) {
    selectHorario.innerHTML = "<option>Escolha um serviço e uma data</option>";
    selectHorario.disabled = true;
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/disponibilidade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, id_servico: idServico })
    });

    const horariosDisponiveis = await response.json();

    const todosHorarios = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    selectHorario.innerHTML = '<option value="">Selecione um horário</option>';
    todosHorarios.forEach(h => {
      const option = document.createElement("option");
      option.value = h;
      // Caso o backend retorne array de strings (horários livres)
      if (Array.isArray(horariosDisponiveis) && horariosDisponiveis.includes(h)) {
        option.textContent = `${h} - Disponível`;
      }
      // Caso o backend retorne objetos {hora, reservado}
      else if (!Array.isArray(horariosDisponiveis) && horariosDisponiveis.some(hor => hor.hora === h && !hor.reservado)) {
        option.textContent = `${h} - Disponível`;
      }
      else {
        option.textContent = `${h} - Reservado`;
        option.disabled = true;
      }

      selectHorario.appendChild(option);
    });

    selectHorario.disabled = false;
  } catch (err) {
    console.error("Erro ao carregar horários:", err);
    selectHorario.innerHTML = "<option>Erro ao carregar horários</option>";
    selectHorario.disabled = true;
  }
});

async function carregarFuncionarios() {
  try {
    const response = await fetch("http://localhost:3000/funcionarios");
    const funcionarios = await response.json();
    const selectFuncionario = document.getElementById("idFuncionario");

    selectFuncionario.innerHTML = '<option value="">-- Selecione um funcionário --</option>';

    funcionarios.forEach(func => {
      const option = document.createElement("option");
      option.value = func.id;
      option.textContent = func.nome;
      selectFuncionario.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar funcionários:", err);
  }
}

// Ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  carregarServicos();
  carregarFuncionarios();
  salvarAgendamento();
});