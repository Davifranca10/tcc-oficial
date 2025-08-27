const menuBtn = document.getElementById("menuBtn");
const navBackground = document.getElementById("navBackground");
let showMenu = false;

// Menu Hamburger
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

// Função para renderizar os cartões (modo mobile)
function renderizarCartoes(agendamentos) {
  const container = document.getElementById("agendamentosCards");
  if (!container) return;

  container.innerHTML = "";

  if (agendamentos.length === 0) {
    container.innerHTML = `
      <div class="agendamento-card">
        <p>Nenhum agendamento encontrado.</p>
      </div>`;
    return;
  }

  agendamentos.forEach((agendamento) => {
    const card = document.createElement("div");
    card.className = "agendamento-card";
    card.innerHTML = `
      <h4>${agendamento.servico_nome}</h4>
      <p><strong>Profissional:</strong> ${agendamento.funcionario_nome}</p>
      <p><strong>Data:</strong> ${new Date(agendamento.data).toLocaleDateString("pt-BR")}</p>
      <p><strong>Horário:</strong> ${agendamento.horario}</p>
      <span class="status ${agendamento.status}">${agendamento.status}</span>
    `;
    container.appendChild(card);
  });
}

// Carregar agendamentos
document.addEventListener("DOMContentLoaded", async () => {
  const id_cliente = Number(localStorage.getItem("id_cliente"));

  if (!id_cliente) {
    alert("Você precisa estar logado para ver seus agendamentos!");
    window.location.href = "../../login.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/agendamentos/cliente/${id_cliente}`);
    
    if (!response.ok) {
      throw new Error("Erro ao carregar agendamentos");
    }

    const agendamentos = await response.json();
    const tbody = document.querySelector("#meusAgendamentosTable tbody");

    // Limpa tabela
    tbody.innerHTML = "";

    if (agendamentos.length === 0) {
      // Tabela
      tbody.innerHTML = `<tr><td colspan="5">Nenhum agendamento encontrado</td></tr>`;
      // Cartões
      renderizarCartoes([]);
    } else {
      // ✅ Mostra todos os agendamentos (sem filtrar por status)
      agendamentos.forEach((agendamento) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${agendamento.servico_nome}</td>
          <td>${agendamento.funcionario_nome}</td>
          <td>${new Date(agendamento.data).toLocaleDateString("pt-BR")}</td>
          <td>${agendamento.horario}</td>
          <td class="status ${agendamento.status}">${agendamento.status}</td>
        `;
        tbody.appendChild(row);
      });

      // ✅ Renderiza todos os agendamentos nos cartões (mobile)
      renderizarCartoes(agendamentos);
    }

  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    
    const tbody = document.querySelector("#meusAgendamentosTable tbody");
    tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar dados</td></tr>`;
    
    const container = document.getElementById("agendamentosCards");
    if (container) {
      container.innerHTML = `
        <div class="agendamento-card">
          <p>Erro ao carregar agendamentos.</p>
        </div>
      `;
    }
  }
});