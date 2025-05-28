document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/servicos")
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector("#serviceTable tbody");
      data.forEach(service => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${service.id}</td>
          <td>${service.nome}</td>
          <td>${service.descricao}</td>
          <td>R$ ${parseFloat(service.preco).toFixed(2)}</td>
          <td>${service.duracao} min</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar serviços:", err);
      alert("Erro ao carregar serviços.");
    });

  // Evento botão de adicionar serviço
  document.getElementById("addServiceBtn").addEventListener("click", () => {
    window.location.href = "../adicionar/index.html";
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
