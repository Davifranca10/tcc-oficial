document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#serviceTable tbody");
  const deleteBtn = document.getElementById("deleteServiceBtn");
  let selectedServiceId = null;

  // Carrega os serviços do backend
  fetch("http://localhost:3000/servicos")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((services) => {
      if (services.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="6">Nenhum serviço encontrado.</td>`;
        tbody.appendChild(row);
        return;
      }

      services.forEach((service) => {
        const tr = document.createElement("tr");
        tr.dataset.id = service.id; // Armazena o ID para uso no delete
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

        // Remove seleção anterior
        document.querySelectorAll("#serviceTable tbody tr").forEach((r) => r.classList.remove("selected"));
        // Adiciona nova seleção
        row.classList.add("selected");
        // Atualiza o ID selecionado
        selectedServiceId = row.dataset.id;
      });


      // Botão de editar
      document.getElementById("editServiceBtn").addEventListener("click", () => {
        if (!selectedServiceId) {
          alert("Selecione um serviço antes de editar.");
          return;
        }
        window.location.href = `../editar/index.html?id=${selectedServiceId}`;
      });

      // Botão de deletar
      deleteBtn.addEventListener("click", () => {
        if (!selectedServiceId) {
          alert("Selecione um serviço para excluir.");
          return;
        }

        const serviceName = document.querySelector(`tr[data-id="${selectedServiceId}"] td:nth-child(2)`).textContent;

        if (confirm(`Tem certeza que deseja excluir o serviço "${serviceName}"?`)) {
          // Desabilita o botão durante a requisição
          deleteBtn.disabled = true;
          deleteBtn.textContent = "Excluindo...";

          fetch(`http://localhost:3000/servicos/${selectedServiceId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then((data) => {
                  throw new Error(data.message || "Erro desconhecido");
                });
              }
              return response.json();
            })
            .then((data) => {
              alert(data.message);
              // Remove a linha da tabela
              document.querySelector(`tr[data-id="${selectedServiceId}"]`).remove();
              selectedServiceId = null;

              // Se não houver mais linhas, mostra mensagem
              if (tbody.querySelectorAll("tr").length === 0) {
                const row = document.createElement("tr");
                row.innerHTML = `<td colspan="6">Nenhum serviço encontrado.</td>`;
                tbody.appendChild(row);
              }
            })
            .catch((err) => {
              console.error("Erro ao excluir serviço:", err);
              alert(`Erro: ${err.message}`);
            })
            .finally(() => {
              // Reativa o botão
              deleteBtn.disabled = false;
              deleteBtn.textContent = "Deletar";
            });
        }
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar serviços:", err);
      alert("Erro ao carregar serviços. Verifique a conexão com o servidor.");
    });

  
});