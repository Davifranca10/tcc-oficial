

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Buscar dados da visão geral
        const res = await fetch("http://localhost:3000/admin/visao-geral");
        const data = await res.json();

        // Buscar dados do comparativo de crescimento
        const resCrescimento = await fetch("http://localhost:3000/admin/comparativo-crescimento");
        const dataCrescimento = await resCrescimento.json();

        // Buscar dados do lucro estimado
        const resLucro = await fetch("http://localhost:3000/admin/lucro-estimado");
        const dataLucro = await resLucro.json();
        const mensal = parseFloat(dataLucro.lucroMensal) || 0;
        const anual = parseFloat(dataLucro.lucroAnual) || 0;

        // Atualiza visão geral
        document.getElementById("totalUsuarios").textContent = data.totalUsuarios;
        document.getElementById("totalServicos").textContent = data.totalServicos;
        document.getElementById("totalFuncionarios").textContent = data.totalFuncionarios;
        document.getElementById("totalAgendamentos").textContent = data.totalAgendamentos;

        // Atualiza status agendamentos
        document.getElementById("agendPendentes").textContent = data.pendentes;
        document.getElementById("agendCancelados").textContent = data.cancelados;
        document.getElementById("agendConfirmados").textContent = data.confirmados;

        // Atualiza pedidos
        document.getElementById("pedidosMes").textContent = data.agendamentosMes || 0;
        document.getElementById("pedidosAno").textContent = data.agendamentosAno || 0;

        // Atualiza comparativo crescimento
        document.getElementById("agendamentosAtual").textContent = dataCrescimento.agendamentosAtual || 0;
        document.getElementById("agendamentosAnterior").textContent = dataCrescimento.agendamentosAnterior || 0;
        document.getElementById("crescimento").textContent = `${dataCrescimento.crescimento || 0}%`;

        // Atualiza lucro estimado
        document.getElementById("lucroMensal").textContent = `R$ ${mensal.toFixed(2)}`;
        document.getElementById("lucroAnual").textContent = `R$ ${anual.toFixed(2)}`;

    } catch (err) {
        console.error("Erro ao buscar dados da visão geral:", err);
    }

    // Buscar serviços mais agendados (TOP 3 estilizado)
    try {
        const resServicos = await fetch("http://localhost:3000/admin/servicos-mais-agendados");
        const dataServicos = await resServicos.json();
        const listaServicos = document.getElementById("servicosMaisAgendados");
        listaServicos.innerHTML = "";

        if (dataServicos.length === 0) {
            listaServicos.innerHTML = "<li>Nenhum serviço encontrado</li>";
        } else {
            dataServicos.forEach((item, index) => {
                const li = document.createElement("li");

                let medalha = "";
                let classe = "";

                if (index === 0) {
                    medalha = "🥇";
                    classe = "gold-rank";
                } else if (index === 1) {
                    medalha = "🥈";
                    classe = "silver-rank";
                } else if (index === 2) {
                    medalha = "🥉";
                    classe = "bronze-rank";
                }

                li.className = `rank-item ${classe}`;
                li.innerHTML = `${medalha} <strong>${index + 1}º</strong> ${item.servico} – ${item.total} agendamentos`;
                listaServicos.appendChild(li);
            });
        }
    } catch (err) {
        console.error("Erro ao buscar serviços mais agendados:", err);
        document.getElementById("servicosMaisAgendados").innerHTML = "<li>Erro ao carregar</li>";
    }

    // Buscar clientes mais ativos (TOP 3 estilizado)
    try {
        const resClientes = await fetch("http://localhost:3000/admin/clientes-mais-ativos");
        const dataClientes = await resClientes.json();
        const listaClientes = document.getElementById("clientesMaisAtivos");
        listaClientes.innerHTML = "";

        if (dataClientes.length === 0) {
            listaClientes.innerHTML = "<li>Nenhum cliente encontrado</li>";
        } else {
            dataClientes.forEach((item, index) => {
                const li = document.createElement("li");

                let medalha = "";
                let classe = "";

                if (index === 0) {
                    medalha = "🥇";
                    classe = "gold-rank";
                } else if (index === 1) {
                    medalha = "🥈";
                    classe = "silver-rank";
                } else if (index === 2) {
                    medalha = "🥉";
                    classe = "bronze-rank";
                }

                li.className = `rank-item ${classe}`;
                li.innerHTML = `${medalha} <strong>${index + 1}º</strong> ${item.cliente} – ${item.total} agendamentos`;
                listaClientes.appendChild(li);
            });
        }
    } catch (err) {
        console.error("Erro ao buscar clientes mais ativos:", err);
        document.getElementById("clientesMaisAtivos").innerHTML = "<li>Erro ao carregar</li>";
    }


   


    // Carregar gráficos
    carregarGraficos();
});

// Função para buscar dados dos gráficos
async function carregarGraficos() {
    try {
        const res = await fetch("http://localhost:3000/admin/graficos");
        const data = await res.json();
        console.log('Dados recebidos do backend:', data);

        renderizarGraficoAgendamentos(data.agendamentosPorMes);
        renderizarGraficoLucroBarra(data.lucroPorMes);
    } catch (err) {
        console.error("Erro ao buscar dados dos gráficos:", err);
    }
}

// Renderiza gráfico de agendamentos por mês (BARRA)
function renderizarGraficoAgendamentos(data) {
    const ctx = document.getElementById("graficoMensal").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(item => item.mes),
            datasets: [{
                label: "Agendamentos",
                data: data.map(item => item.total),
                backgroundColor: "#ff69b4",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: false }
            }
        }
    });
}

// Renderiza gráfico de lucro mensal (LINHA)
function renderizarGraficoLucroBarra(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("Dados do lucro estão vazios ou inválidos:", data);
        return;
    }

    const labels = data.map(item => item.mes || "Mês?");
    const valores = data.map(item => Number(item.total) || 0);

    const ctx = document.getElementById("graficoLucro").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Lucro Estimado (R$)",
                data: valores,
                backgroundColor: "#ffd700",
                borderColor: "#b8860b",
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}