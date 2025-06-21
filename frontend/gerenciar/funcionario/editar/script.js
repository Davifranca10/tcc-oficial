const select = document.getElementById("selectFuncionario");
let funcionarios = [];

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/funcionarios");
    funcionarios = await res.json();

    funcionarios.forEach(func => {
      const opt = document.createElement("option");
      opt.value = func.id;
      opt.textContent = `${func.nome} (${func.email})`;
      select.appendChild(opt);
    });

    if (funcionarios.length > 0) {
      preencherFormulario(funcionarios[0]);
    }
  } catch (err) {
    console.error("Erro ao carregar funcionários:", err);
    alert("Erro ao carregar a lista.");
  }
});

select.addEventListener("change", () => {
  const funcionario = funcionarios.find(f => f.id == select.value);
  if (funcionario) {
    preencherFormulario(funcionario);
  }
});

function preencherFormulario(func) {
  document.getElementById("nome").value = func.nome;
  document.getElementById("especialidade").value = func.especialidade || "";
  document.getElementById("telefone").value = func.telefone;
  document.getElementById("email").value = func.email;
  document.getElementById("senha").value = "";
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = select.value;
  const nome = document.getElementById("nome").value;
  const especialidade = document.getElementById("especialidade").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!id || !senha) {
    return alert("Selecione um funcionário e digite uma nova senha.");
  }

  try {
    const res = await fetch(`http://localhost:3000/funcionarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, especialidade, telefone, email, password: senha })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Funcionário atualizado com sucesso!");
      window.location.reload();
    } else {
      alert(data.message || "Erro ao editar.");
    }
  } catch (err) {
    console.error("Erro ao enviar:", err);
    alert("Erro de conexão com o servidor.");
  }
});
