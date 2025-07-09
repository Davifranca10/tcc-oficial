document.getElementById("formFuncionario").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const nome = document.getElementById("nome").value.trim();
    const especialidade = document.getElementById("especialidade").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
  
    if (!nome || !especialidade || !telefone || !email ) {
      return alert("Preencha todos os campos obrigatórios.");
    }
  
    try {
      const res = await fetch("http://localhost:3000/funcionarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, especialidade, telefone, email})
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Funcionário cadastrado com sucesso!");
        window.location.reload();
      } else {
        alert(data.message || "Erro ao cadastrar.");
      }
    } catch (err) {
      console.error("Erro ao enviar dados:", err);
      alert("Erro na comunicação com o servidor.");
    }
  });
  