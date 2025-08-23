document.addEventListener("DOMContentLoaded", () => {
    const saleGrid = document.getElementById("saleGrid");

    async function loadServicos() {
        try {
            console.log("Buscando serviços...");
            const response = await fetch("http://localhost:3000/servicos");

            if (!response.ok) {
                throw new Error(`Erro ao carregar serviços: ${response.status}`);
            }

            const servicos = await response.json();

            console.log("Serviços recebidos:", servicos);

            if (servicos.length === 0) {
                saleGrid.innerHTML = "<p>Nenhum serviço encontrado.</p>";
                return;
            }

            saleGrid.innerHTML = ""; // Limpa qualquer conteúdo anterior

            servicos.forEach(servico => {
                const card = document.createElement("div");
                card.className = "card";

                const imagePath = servico.imagem_path
                    ? `http://localhost:3000${servico.imagem_path}`
                    : "https://via.placeholder.com/300x250?text=Sem+Imagem";

                card.innerHTML = `
                    <a href="manage/index.html?servico=${encodeURIComponent(servico.nome)}">
                        <img src="${imagePath}" alt="${servico.nome}" />
                        <h2>${servico.nome}</h2>
                        <p><strong>Descrição:</strong> ${servico.descricao || "Sem descrição"}</p>
                        <p><strong>Preço:</strong> R$ ${parseFloat(servico.preco).toFixed(2)}</p>
                        <p><strong>Duração:</strong> ${servico.duracao || 0} minutos</p>
                    </a>
                `;

                saleGrid.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
            saleGrid.innerHTML = "<p>Erro ao carregar serviços. Tente novamente mais tarde.</p>";
        }
    }

    loadServicos();
});