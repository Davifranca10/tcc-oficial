document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("serviceForm");

  form.addEventListener("submit", async (e) => {
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
      // This simulates navigation; replace with real logic if needed
      alert(`Navigating to ${path}`);
  }