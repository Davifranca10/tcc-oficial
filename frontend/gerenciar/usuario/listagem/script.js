document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#userTable tbody");

  if (!tbody) {
    console.error("Elemento tbody não encontrado");
    alert("Erro: tabela não encontrada");
    return;
  }

  // Carregar usuários do backend
  fetch("http://localhost:3000/clients")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(users => {
      if (users.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="4">Nenhum usuário encontrado</td>`;
        tbody.appendChild(tr);
        return;
      }

      users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.telefone}</td>
          <td>${user.email}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar usuários:", err);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="4">Erro ao carregar usuários</td>`;
      tbody.appendChild(tr);
    });

  // Selecionar linha da tabela
  tbody.addEventListener("click", (e) => {
    document.querySelectorAll("#userTable tbody tr").forEach(r => r.classList.remove("selected"));
    const row = e.target.closest("tr");
    if (row) {
      row.classList.add("selected");
    }
  });

  // Botão Editar - usando elemento correto
  const editBtn = document.querySelector("#editBtn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const selected = document.querySelector("tr.selected");
      if (!selected) {
        alert("Selecione um usuário primeiro.");
        return;
      }

      const userId = selected.children[0].textContent.trim();
      window.location.href = `../editar/index.html?id=${userId}`;
    });
  } else {
    console.warn("Botão de editar não encontrado");
  }

  // Botão Deletar - placeholder
  const deleteBtn = document.querySelector("#deleteBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const selected = document.querySelector("tr.selected");
      if (!selected) {
        alert("Selecione um usuário primeiro.");
        return;
      }

      const userId = selected.children[0].textContent.trim();

      if (confirm("Tem certeza que deseja deletar esse usuário?")) {
        fetch(`http://localhost:3000/clients/${userId}`, {
          method: "DELETE"
        })
          .then(res => res.json())
          .then(() => {
            alert("Usuário deletado com sucesso!");
            window.location.reload();
          })
          .catch(err => {
            console.error("Erro ao deletar usuário:", err);
            alert("Erro ao deletar usuário.");
          });
      }
    });
  } else {
    console.warn("Botão de deletar não encontrado");
  }
});