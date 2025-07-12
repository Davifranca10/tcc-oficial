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

document.addEventListener("DOMContentLoaded", async () => {
  const id_cliente = localStorage.getItem("id_cliente");
  const tbody = document.querySelector("#meusAgendamentosTable tbody");

  if (!id_cliente) {
    alert("Você precisa estar logado para ver seus agendamentos.");
    window.location.href = "/frontend/login.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/agendamentos`);
    const agendamentos = await res.json();

    const meusAgendamentos = agendamentos.filter(a => a.id_cliente == id_cliente);

    if (meusAgendamentos.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5">Nenhum agendamento encontrado.</td>`;
      tbody.appendChild(tr);
      return;
    }

    meusAgendamentos.forEach(a => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.servico_nome || "Desconhecido"}</td>
        <td>${a.funcionario_nome || "Desconhecido"}</td>
        <td>${new Date(a.data).toLocaleDateString()}</td>
        <td>${a.horario}</td>
        <td>${a.status}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar agendamentos do cliente:", err);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5">Erro ao carregar dados.</td>`;
    tbody.appendChild(tr);
  }
});