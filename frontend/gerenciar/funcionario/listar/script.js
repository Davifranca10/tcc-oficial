window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/funcionarios");
    const funcionarios = await response.json();

    const tbody = document.querySelector("#tabelaFuncionarios tbody");

    funcionarios.forEach(func => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${func.id}</td>
        <td>${func.nome}</td>
        <td>${func.especialidade}</td>
        <td>${func.telefone}</td>
        <td>${func.email}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao buscar funcionários:", err);
    alert("Erro ao carregar a lista de funcionários.");
  }
});
