// Variáveis globais
const selectServico = document.querySelector("select[name='id_servico']");
const previewImagem = document.getElementById("previewImagem");

// Função para carregar serviços e preencher a combo box
async function carregarServicos() {
  try {
    const response = await fetch("http://localhost:3000/servicos");
    if (!response.ok) throw new Error("Erro ao carregar serviços");

    const servicos = await response.json();

    // Limpa combobox e preenche com os serviços
    selectServico.innerHTML = '<option value="">-- Selecione um serviço --</option>';

    servicos.forEach(servico => {
      const option = document.createElement("option");
      option.value = servico.id;
      option.textContent = `${servico.nome} - R$${parseFloat(servico.preco).toFixed(2)}`;
      option.dataset.imagem = servico.imagem_path ? `http://localhost:3000${servico.imagem_path}` : "";
      selectServico.appendChild(option);
    });

    // Seleciona automaticamente se vier da página de vendas
    const urlParams = new URLSearchParams(window.location.search);
    const servicoNome = urlParams.get("servico");

    if (servicoNome) {
      const decodedName = decodeURIComponent(servicoNome);
      const match = servicos.find(s => s.nome === decodedName);

      if (match) {
        selectServico.value = match.id;
        // Dispara evento change para carregar a imagem
        const event = new Event("change");
        selectServico.dispatchEvent(event);
      }
    }

    // Atualiza a imagem ao mudar a seleção
    selectServico.addEventListener("change", () => {
      const selectedOption = selectServico.options[selectServico.selectedIndex];
      const imagemPath = selectedOption.dataset.imagem;

      if (imagemPath) {
        previewImagem.src = imagemPath;
        previewImagem.alt = selectedOption.text;
      } else {
        previewImagem.src = "https://via.placeholder.com/300x250?text=Sem+Imagem";
        previewImagem.alt = "Sem Imagem";
      }
    });

  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    selectServico.innerHTML = "<option disabled selected>Erro ao carregar serviços</option>";
    previewImagem.src = "https://via.placeholder.com/300x250?text=Erro+ao+carregar";
  }
}

// Chama função ao carregar a página
window.addEventListener("DOMContentLoaded", carregarServicos);