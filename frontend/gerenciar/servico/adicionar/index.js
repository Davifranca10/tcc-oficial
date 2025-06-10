document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("serviceForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const duracao = parseInt(document.getElementById("duracao").value);
    const imagemInput = document.getElementById("imagem");

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    formData.append("duracao", duracao);

    if (imagemInput.files.length > 0) {
      formData.append("imagem", imagemInput.files[0]); // <<== aqui corrigido
    }

    try {
      const response = await fetch("http://localhost:3000/servicos", {
        method: "POST",
        body: formData, // importante: NÃO setar Content-Type manualmente
      });

      const resultado = await response.json();

      if (response.ok) {
        alert("Serviço cadastrado com sucesso!");
        window.location.href = "../listagem/index.html";
      } else {
        alert(resultado.message || "Erro ao cadastrar serviço.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro de conexão com o servidor.");
    }
  });
});

// Código do menu (sem mudanças)
const menuBtn = document.getElementById("menuBtn");
const navBackground = document.getElementById("navBackground");
let showMenu = false;

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

function navigateTo(path) {
  alert(`Navigating to ${path}`);
}
