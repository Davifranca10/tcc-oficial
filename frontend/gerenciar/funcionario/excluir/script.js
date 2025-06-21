const select = document.getElementById("selectFuncionario");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/funcionarios");
    const funcionarios = await res.json();

    funcionarios.forEach(func => {
      const opt = document.createElement("option");
      opt.value = func.id;
      opt.textContent = `${func.nome} (${func.email})`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Erro ao carregar funcionários:", err);
    alert("Erro ao carregar funcionários.");
  }
});

document.getElementById("deleteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = select.value;
  const confirmado = confirm("Tem certeza que deseja excluir este funcionário?");

  if (!confirmado) return;

  try {
    const res = await fetch(`http://localhost:3000/funcionarios/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();
    if (res.ok) {
      alert("Funcionário deletado com sucesso!");
      window.location.reload();
    } else {
      alert(data.message || "Erro ao deletar.");
    }
  } catch (err) {
    console.error("Erro ao deletar funcionário:", err);
    alert("Erro ao se comunicar com o servidor.");
  }
});
