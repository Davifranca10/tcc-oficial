document.addEventListener("DOMContentLoaded", () => {
    
    fetch("http://localhost:3000/services")
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector("#serviceTable tbody");
        data.forEach(service => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${service.id}</td>
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>${service.price}</td>
            <td>${service.value}</td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Erro ao buscar serviços:", err);
        alert("Erro ao carregar serviços.");
      });
  
    document.getElementById("editBtn").addEventListener("click", () => {
      alert("Função editar ainda não implementada.");
    });
  
    document.getElementById("deleteBtn").addEventListener("click", () => {
      alert("Função deletar ainda não implementada.");
    });

    // Evento para o botão de adicionar serviço
    document.getElementById("addServiceBtn").addEventListener("click", () => {
      window.location.href = "../adicionar-servico/index.html"; // Redirecionamento para a página de adicionar serviço
    });
  });

  // Adiciona seleção de linha na tabela
document.querySelector("#serviceTable tbody").addEventListener("click", (e) => {
    const rows = document.querySelectorAll("#serviceTable tbody tr");
    rows.forEach(r => r.classList.remove("selected"));
  
    const selectedRow = e.target.closest("tr");
    if (selectedRow) {
      selectedRow.classList.add("selected");
    }
  });
  
  // Redireciona para a tela de edição com o ID do serviço selecionado
  document.getElementById("editBtn").addEventListener("click", () => {
    const selected = document.querySelector("tr.selected");
    if (!selected) {
      return alert("Selecione um serviço para editar.");
    }
  
    const serviceId = selected.children[0].textContent; // coluna ID
    window.location.href = `../editar/index.html?id=${serviceId}`;
  });
