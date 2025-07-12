document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#scheduleTable tbody");

  if (!tbody) {
    console.error("Elemento tbody não encontrado");
    alert("Erro: tabela não encontrada");
    return;
  }

  // Carregar agendamentos do backend
  fetch("http://localhost:3000/agendamentos")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(agendamentos => {
      if (agendamentos.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="7">Nenhum agendamento encontrado</td>`;
        tbody.appendChild(tr);
        return;
      }

      agendamentos.forEach(agendamento => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${agendamento.id}</td>
        <td>${agendamento.cliente_nome || "Desconhecido"}</td>
        <td>${agendamento.servico_nome || "Desconhecido"}</td>
        <td>${agendamento.funcionario_nome || "Desconhecido"}</td>
         <td>${new Date(agendamento.data).toLocaleDateString()}</td>
        <td>${agendamento.horario}</td>
       <td>${agendamento.status}</td>
`;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar agendamentos:", err);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="7">Erro ao carregar agendamentos</td>`;
      tbody.appendChild(tr);
    });

  // Seleção de linha
  tbody.addEventListener("click", (e) => {
    document.querySelectorAll("#scheduleTable tbody tr").forEach(r => r.classList.remove("selected"));
    const row = e.target.closest("tr");
    if (row) row.classList.add("selected");
  });

  // Botão Aceitar
  const acceptBtn = document.getElementById("acceptBtn");
if (acceptBtn) {
  acceptBtn.addEventListener("click", async () => {
    const selected = document.querySelector("#scheduleTable tbody tr.selected");
    if (!selected) {
      alert("Selecione um agendamento primeiro.");
      return;
    }

    const scheduleId = selected.children[0].textContent.trim();

    try {
      const response = await fetch(`http://localhost:3000/agendamentos/${scheduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "aceito" }) // só envia o status para atualizar
      });

      if (response.ok) {
        alert("Status alterado para aceito!");
        window.location.reload();
      } else {
        alert("Erro ao atualizar status.");
      }
    } catch (err) {
      console.error("Erro ao aceitar agendamento:", err);
      alert("Erro ao aceitar agendamento.");
    }
  });
}

  // Botão Recusar
  const rejectBtn = document.getElementById("rejectBtn");
  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      const selected = document.querySelector("#scheduleTable tbody tr.selected");
      if (!selected) {
        alert("Selecione um agendamento primeiro.");
        return;
      }

      const scheduleId = selected.children[0].textContent.trim();

      if (confirm("Tem certeza que deseja recusar esse agendamento?")) {
        fetch(`http://localhost:3000/agendamentos/${scheduleId}`, {
          method: "DELETE"
        })
          .then(() => {
            alert("Agendamento recusado e excluído com sucesso!");
            window.location.reload();
          })
          .catch(err => {
            console.error("Erro ao deletar agendamento:", err);
            alert("Erro ao recusar agendamento.");
          });
      }
    });
  }

  // Botão Editar
  const editBtn = document.getElementById("editBtn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const selected = document.querySelector("#scheduleTable tbody tr.selected");
      if (!selected) {
        alert("Selecione um agendamento primeiro.");
        return;
      }

      const scheduleId = selected.children[0].textContent.trim();
      window.location.href = `../editar/index.html?id=${scheduleId}`;
    });
  }

  /* MENU HAMBÚRGUER */
  const menuBtn = document.getElementById("menuBtn");
  const navBackground = document.getElementById("navBackground");
  let showMenu = false;

  if (menuBtn && navBackground) {
    menuBtn.addEventListener("click", () => {
      showMenu = !showMenu;
      menuBtn.classList.toggle("close", showMenu);
      navBackground.classList.toggle("show", showMenu);
      navBackground.style.transitionDelay = showMenu ? "0s" : "0.25s";
      navBackground.childNodes.forEach((el) => {
        if (el.nodeType === 1) {
          el.style.transitionDelay = showMenu ? "0.25s" : "0s";
        }
      });
    });
  } else {
    console.warn("Elementos do menu hambúrguer não encontrados.");
  }
});