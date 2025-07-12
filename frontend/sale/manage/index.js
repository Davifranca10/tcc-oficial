

// Variáveis globais 
const selectServico = document.querySelector("select[name='id_servico']");
const previewImagem = document.getElementById("previewImagem");
const nomeFuncionario = document.getElementById("nomeFuncionario"); // Exibe o nome do funcionário
const idFuncionarioInput = document.getElementById("idFuncionario"); // Campo oculto para enviar o ID

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
    if (nomeFuncionario) nomeFuncionario.textContent = "-";
    if (idFuncionarioInput) idFuncionarioInput.value = "";
  }
}

// Função para salvar agendamento no banco
async function salvarAgendamento() {
  const form = document.getElementById("form-agendamento");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idServico = selectServico.value;
    const idFuncionario = idFuncionarioInput.value;
    const data = document.querySelector("input[name='data']").value;
    const horario = document.querySelector("select[name='horario']").value;
    const idCliente = localStorage.getItem("id_cliente");

    if (!idCliente) {
      alert("Você precisa estar logado para agendar.");
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

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erro ao agendar.");
      }

      alert("Agendamento enviado com sucesso! Aguarde a confirmação.");
      form.reset();
      nomeFuncionario.textContent = "-";
      previewImagem.src = "https://via.placeholder.com/300x250?text=Selecione+um+serviço";
    } catch (err) {
      console.error("Erro ao enviar agendamento:", err.message);
      alert("Erro ao enviar agendamento.");
    }
  });
}

// Quando a página estiver carregada
window.addEventListener("DOMContentLoaded", () => {
  carregarServicos();
  salvarAgendamento();
});