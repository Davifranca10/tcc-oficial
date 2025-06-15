document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#serviceTable tbody");

  // Carrega os serviços do backend
  fetch("http://localhost:3000/servicos")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(services => {
      if (services.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="6">Nenhum serviço encontrado.</td>`;
        tbody.appendChild(row);
        return;
      }

      services.forEach(service => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${service.id}</td>
          <td>${service.nome}</td>
          <td>${service.descricao || "-"}</td>
          <td>R$ ${parseFloat(service.preco).toFixed(2)}</td>
          <td>${service.duracao || 0} min</td>
          <td>${service.nome_funcionario || "Não atribuído"}</td>
        `;
        tbody.appendChild(tr);
      });

      // Selecionar linha da tabela
      tbody.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        if (!row) return;

        document.querySelectorAll("#serviceTable tbody tr").forEach(r => r.classList.remove("selected"));
        row.classList.add("selected");
      });

      // Botão de editar
      document.getElementById("editLink").addEventListener("click", (e) => {
        const selected = document.querySelector("tr.selected");
        if (!selected) {
          e.preventDefault();
          alert("Selecione um serviço antes de editar.");
        }
      });

    })
    .catch(err => {
      console.error("Erro ao carregar serviços:", err);
      alert("Erro ao carregar serviços.");
    });
});

// Evento botão de adicionar serviço
document.getElementById("addServiceBtn").addEventListener("click", () => {
  window.location.href = "../adicionar/index.html";
});