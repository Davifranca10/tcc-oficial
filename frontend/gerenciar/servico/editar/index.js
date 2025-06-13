const serviceSelect = document.getElementById("serviceSelect");
const form = document.getElementById("editForm");
const nomeInput = document.getElementById("nome");
const descricaoInput = document.getElementById("descricao");
const precoInput = document.getElementById("preco");
const duracaoInput = document.getElementById("duracao");
const imagemInput = document.getElementById("imagem");
const previewImagem = document.getElementById("previewImagem");

let servicos = [];

// Carrega todos os serviços para o select
async function carregarServicos() {
  try {
    const res = await fetch("http://localhost:3000/servicos");
    if (!res.ok) throw new Error("Erro ao carregar serviços");

    servicos = await res.json();

    serviceSelect.innerHTML = '<option value="">-- Selecione --</option>';
    servicos.forEach(servico => {
      const option = document.createElement("option");
      option.value = servico.id;
      option.textContent = `${servico.nome} - R$${parseFloat(servico.preco).toFixed(2)} (${servico.duracao} min)`;
      serviceSelect.appendChild(option);
    });

    if (servicos.length > 0) {
      fillForm(servicos[0]);
    }

    serviceSelect.addEventListener("change", () => {
      const selectedId = serviceSelect.value;
      const selectedService = servicos.find(s => s.id == selectedId);
      if (selectedService) {
        fillForm(selectedService);
      }
    });

  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    serviceSelect.innerHTML = "<option disabled selected>Erro ao carregar</option>";
  }
}

// Preenche os campos do formulário
function fillForm(servico) {
  nomeInput.value = servico.nome;
  descricaoInput.value = servico.descricao || "";
  precoInput.value = parseFloat(servico.preco).toFixed(2);
  duracaoInput.value = servico.duracao || "";

  // Mostra a imagem atual
  if (servico.imagem_path) {
    previewImagem.src = "http://localhost:3000" + servico.imagem_path;
    previewImagem.style.display = "block";
  } else {
    previewImagem.style.display = "none";
  }
}

// Preview da nova imagem (se selecionada)
imagemInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImagem.src = event.target.result;
      previewImagem.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Submissão do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = serviceSelect.value;

  const formData = new FormData();
  formData.append("nome", nomeInput.value);
  formData.append("descricao", descricaoInput.value);
  formData.append("preco", precoInput.value);
  formData.append("duracao", duracaoInput.value);

  // Se houver nova imagem, adiciona ao FormData
  const file = imagemInput.files[0];
  if (file) {
    formData.append("imagem", file);
  } else {
    // Opcional: manter caminho da imagem antiga como string vazia ou nulo
    formData.append("imagem_path", ""); // só pra garantir compatibilidade
  }

  try {
    const res = await fetch(`http://localhost:3000/servicos/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) throw new Error("Erro ao atualizar serviço");

    alert("Serviço atualizado com sucesso!");
    window.location.reload();
  } catch (err) {
    alert("Erro ao salvar alterações.");
    console.error(err);
  }
});

// Inicialização
window.addEventListener("DOMContentLoaded", carregarServicos);