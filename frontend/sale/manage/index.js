// Variáveis globais 
const selectServico = document.querySelector("select[name='id_servico']");
const previewImagem = document.getElementById("previewImagem");
const nomeFuncionario = document.getElementById("nomeFuncionario");
const idFuncionarioInput = document.getElementById("idFuncionario");
const campoData = document.getElementById("campoData");
const selectHorario = document.getElementById("selectHorario");

const menuBtn = document.getElementById("menuBtn");
const navBackground = document.getElementById("navBackground");
let showMenu = false;

// Menu toggle
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

// Função para carregar serviços
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

    // Pré-seleciona serviço pela URL (ex: ?servico=Corte)
    const urlParams = new URLSearchParams(window.location.search);
    const servicoNome = urlParams.get("servico");
    if (servicoNome) {
      const decodedName = decodeURIComponent(servicoNome);
      const match = servicos.find(s => s.nome === decodedName);
      if (match) {
        selectServico.value = match.id;
        // Dispara evento change para atualizar imagem e funcionário
        setTimeout(() => selectServico.dispatchEvent(new Event("change")), 0);
      }
    }

    // Atualiza imagem e funcionário ao mudar serviço
    selectServico.addEventListener("change", () => {
      // Reseta campos de data e horário
      campoData.value = "";
      selectHorario.innerHTML = '<option>Selecione uma data primeiro</option>';
      selectHorario.disabled = true;

      const selectedOption = selectServico.options[selectServico.selectedIndex];
      const imagemPath = selectedOption.dataset.imagem;
      const nomeFunc = selectedOption.dataset.funcionarioNome;
      const idFunc = selectedOption.dataset.funcionarioId;

      // Atualiza imagem com fallback
      previewImagem.src = "https://via.placeholder.com/300x250?text=Carregando...";
      previewImagem.alt = "Carregando...";

      if (imagemPath) {
        const tempImg = new Image();
        tempImg.onload = () => {
          previewImagem.src = imagemPath;
          previewImagem.alt = selectedOption.text;
        };
        tempImg.onerror = () => {
          previewImagem.src = "https://via.placeholder.com/300x250?text=Imagem+N%C3%A3o+Encontrada";
          previewImagem.alt = "Imagem não encontrada";
        };
        tempImg.src = imagemPath;
      } else {
        previewImagem.src = "https://via.placeholder.com/300x250?text=Sem+Imagem";
        previewImagem.alt = "Sem imagem";
      }

      nomeFuncionario.textContent = nomeFunc;
      idFuncionarioInput.value = idFunc || "";
    });

  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    selectServico.innerHTML = "<option disabled>Erro ao carregar serviços</option>";
    previewImagem.src = "https://via.placeholder.com/300x250?text=Erro";
    nomeFuncionario.textContent = "-";
    idFuncionarioInput.value = "";
  }
}

// Função para salvar agendamento
function salvarAgendamento() {
  const form = document.getElementById("form-agendamento");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idCliente = localStorage.getItem("id_cliente");
    if (!idCliente) return alert("Você precisa estar logado para agendar.");

    const idServico = selectServico.value;
    const idFuncionario = idFuncionarioInput.value;
    const data = campoData.value;
    const horario = selectHorario.value;

    if (!idServico || !idFuncionario || !data || !horario) {
      return alert("Preencha todos os campos.");
    }

    // Validação de final de semana
    const diaSelecionado = new Date(data).getDay();
    if (diaSelecionado === 0 || diaSelecionado === 6) {
      return alert("Agendamentos não são permitidos aos finais de semana.");
    }

    // Envia agendamento
    fetch("http://localhost:3000/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cliente: idCliente, id_servico: idServico, id_funcionario: idFuncionario, data, horario })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Erro ao agendar.");
        alert("Agendamento enviado! Aguarde a confirmação.");
        window.location.href = "/frontend/index.html";
      })
      .catch(err => {
        console.error("Erro:", err.message);
        alert(err.message);
      });
  });
}

// Carregar horários disponíveis com base na data e serviço
campoData.addEventListener("input", async function () {
  const data = this.value;
  const idServico = selectServico.value;

  // Valida final de semana
  const diaSemana = new Date(data).getDay();
  if (diaSemana === 0 || diaSemana === 6) {
    alert("Não é permitido agendar aos finais de semana.");
    this.value = "";
    selectHorario.innerHTML = '<option>Selecione uma data válida</option>';
    selectHorario.disabled = true;
    return;
  }

  if (!data || !idServico) {
    selectHorario.innerHTML = '<option>Escolha serviço e data</option>';
    selectHorario.disabled = true;
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/disponibilidade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, id_servico: idServico })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao carregar horários.");
    }

    const horariosDisponiveis = await response.json(); // Array de strings: ["08:00", "09:30", ...]

    // Lista fixa de horários possíveis (8h às 18h, a cada 30 min, com intervalo de almoço)
    const todosHorarios = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    // Limpa o select
    selectHorario.innerHTML = "";
    
    // Adiciona opção inicial
    const optionInicial = document.createElement("option");
    optionInicial.value = "";
    optionInicial.textContent = "Selecione um horário";
    selectHorario.appendChild(optionInicial);

    let adicionouSeparador = false;

    todosHorarios.forEach(hora => {
      // Adiciona o separador de almoço entre 11:30 e 13:00
      if (!adicionouSeparador && hora >= "13:00") {
        const optionAlmoco = document.createElement("option");
        optionAlmoco.textContent = "———— Almoço (12h às 13h) ————";
        optionAlmoco.disabled = true;
        optionAlmoco.style.textAlign = "center";
        optionAlmoco.style.backgroundColor = "#f8f9fa";
        optionAlmoco.style.color = "#6c757d";
        optionAlmoco.style.fontStyle = "italic";
        optionAlmoco.style.fontWeight = "bold";
        optionAlmoco.style.pointerEvents = "none"; // Previne seleção indesejada
        selectHorario.appendChild(optionAlmoco);
        adicionouSeparador = true;
      }

      const option = document.createElement("option");
      option.value = hora;
      
      // Define texto e estilo com base na disponibilidade
      if (horariosDisponiveis.includes(hora)) {
        option.textContent = `${hora} - Disponível`;
        option.style.color = "#007bff";
      } else {
        option.textContent = `${hora} - Ocupado`;
        option.disabled = true;
        option.style.color = "#dc3545";
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
// Inicialização
window.addEventListener("DOMContentLoaded", () => {
  carregarServicos();
  salvarAgendamento();
});