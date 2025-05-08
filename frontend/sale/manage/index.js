function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
  }
  
  document.getElementById("form-agendamento").addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(this);
  
    const data = {
      id_cliente: formData.get("id_cliente"),
      id_servico: formData.get("id_servico"),
      data: formData.get("data"),
      horario: formData.get("horario"),
      id_funcionario: formData.get("id_funcionario"),
    };
  
    fetch("http://localhost:3000/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        alert("Agendamento realizado com sucesso!");
        this.reset();
      })
      .catch(error => {
        console.error("Erro no agendamento:", error);
        alert("Erro ao agendar. Tente novamente.");
      });
  });
  