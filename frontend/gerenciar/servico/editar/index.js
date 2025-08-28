const form = document.getElementById("editForm");
const nomeInput = document.getElementById("nome");
const descricaoInput = document.getElementById("descricao");
const precoInput = document.getElementById("preco");
const duracaoInput = document.getElementById("duracao");
const imagemInput = document.getElementById("imagem");
const previewImagem = document.getElementById("previewImagem");
const serviceIdInput = document.getElementById("serviceId"); // hidden input

// Extrai o parâmetro 'id' da URL
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Carrega os dados do serviço específico
async function carregarServico(id) {
  try {
    const res = await fetch(`http://localhost:3000/servicos/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Serviço não encontrado.");
      } else {
        throw new Error("Erro ao carregar serviço.");
      }
    }

    const servico = await res.json();

    // Preenche os campos
    nomeInput.value = servico.nome;
    descricaoInput.value = servico.descricao || "";
    precoInput.value = parseFloat(servico.preco).toFixed(2);
    duracaoInput.value = servico.duracao || "";
    serviceIdInput.value = servico.id;
    document.getElementById("id_funcionario").value = servico.id_funcionario || "";

    // Mostra prévia da imagem existente
    if (servico.imagem_path) {
      previewImagem.src = `http://localhost:3000${servico.imagem_path}`;
      previewImagem.style.display = "block";
    } else {
      previewImagem.style.display = "none";
    }
  } catch (error) {
    console.error("Erro ao carregar serviço:", error);
    alert(error.message);
    // Opcional: redirecionar para listagem
    window.location.href = "../listagem/index.html";
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

  const id = serviceIdInput.value;

  if (!id) {
    alert("ID do serviço não encontrado.");
    return;
  }

  const formData = new FormData();
  formData.append("nome", nomeInput.value);
  formData.append("descricao", descricaoInput.value || "");
  formData.append("preco", precoInput.value);
  formData.append("duracao", duracaoInput.value);
  formData.append("id_funcionario", document.getElementById("id_funcionario").value);

  const file = imagemInput.files[0];
  if (file) {
    formData.append("imagem", file);
  }

  try {
    const res = await fetch(`http://localhost:3000/servicos/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json().catch(() => ({ message: "Erro desconhecido" }));

    if (!res.ok) {
      throw new Error(data.message || "Erro ao atualizar serviço.");
    }

    alert("Serviço atualizado com sucesso!");
    window.location.href = "../listagem/index.html"; // Redireciona para listagem
  } catch (err) {
    console.error("Erro ao atualizar serviço:", err);
    alert("Erro: " + err.message);
  }
});

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
  const id = getUrlParameter("id");
  if (!id) {
    alert("ID do serviço não fornecido.");
    window.location.href = "index.html"; // ou listagem
    return;
  }
  carregarServico(id);
});