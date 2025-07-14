document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("serviceForm");
  const funcionarioSelect = document.getElementById("funcionarioSelect");

  // Carrega os funcionários para o select
  fetch("http://localhost:3000/funcionarios")
    .then(res => res.json())
    .then(funcionarios => {
      funcionarioSelect.innerHTML = '<option value="">-- Selecione --</option>';
      funcionarios.forEach(func => {
        const option = document.createElement("option");
        option.value = func.id;
        option.textContent = func.nome;
        funcionarioSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar funcionários:", err);
      alert("Erro ao carregar lista de funcionários.");
    });

  // Lógica de envio do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const duracao = parseInt(document.getElementById("duracao").value);
    const imagemInput = document.getElementById("imagem");
    const id_funcionario = funcionarioSelect.value;

    if (!nome || !preco || !duracao || !id_funcionario) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    formData.append("duracao", duracao);
    formData.append("id_funcionario", id_funcionario);

    if (imagemInput.files.length > 0) {
      formData.append("imagem", imagemInput.files[0]);
    }

    try {
      const response = await fetch("http://localhost:3000/servicos", {
        method: "POST",
        body: formData,
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

