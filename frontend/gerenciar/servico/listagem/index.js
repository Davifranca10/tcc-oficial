document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/servicos")
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector("#serviceTable tbody");
      data.forEach(service => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${service.id}</td>
          <td>${service.nome}</td>
          <td>${service.descricao}</td>
          <td>R$ ${parseFloat(service.preco).toFixed(2)}</td>
          <td>${service.duracao} min</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar serviços:", err);
      alert("Erro ao carregar serviços.");
    });

  // Evento botão de adicionar serviço
  document.getElementById("addServiceBtn").addEventListener("click", () => {
    window.location.href = "../adicionar/index.html";
  });
});
