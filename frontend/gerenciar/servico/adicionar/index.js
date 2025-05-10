document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("serviceForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const duracao = parseInt(document.getElementById("duracao").value);

    try {
      const response = await fetch("http://localhost:3000/servicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, descricao, preco, duracao })
      });

      const resultado = await response.json();

      if (response.ok) {
        alert("Serviço cadastrado com sucesso!");
        window.location.href = "../listagem/index.html";
      } else {
        alert(resultado.message || "Erro ao cadastrar serviço.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro de conexão com o servidor.");
    }
  });
});
