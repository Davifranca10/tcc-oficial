
document.addEventListener("DOMContentLoaded", () => {
  const tabelaCorpo = document.querySelector("#tabelaFuncionarios tbody");

  // URL da API para buscar os funcionários
  const apiUrl = "http://localhost:3000/funcionarios"; // ajuste para sua URL real

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar funcionários: " + response.status);
      }
      return response.json();
    })
    .then((funcionarios) => {
      tabelaCorpo.innerHTML = ""; // limpa tabela antes de preencher

      if (funcionarios.length === 0) {
        tabelaCorpo.innerHTML = `<tr><td colspan="5">Nenhum funcionário encontrado.</td></tr>`;
        return;
      }

      funcionarios.forEach((func) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${func.id}</td>
          <td>${func.nome}</td>
          <td>${func.especialidade || ""}</td>
          <td>${func.telefone || ""}</td>
          <td>${func.email || ""}</td>
        `;

        tabelaCorpo.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Erro:", error);
      tabelaCorpo.innerHTML = `<tr><td colspan="5">Erro ao carregar os funcionários.</td></tr>`;
    });
});