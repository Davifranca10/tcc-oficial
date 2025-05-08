const userSelect = document.getElementById("userSelect");

// Buscar usuários e preencher combobox
fetch("http://localhost:3000/clients")
  .then(res => res.json())
  .then(users => {
    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `${user.name} (${user.email})`;
      userSelect.appendChild(option);
    });
  })
  .catch(err => {
    console.error("Erro ao buscar usuários:", err);
    alert("Erro ao carregar usuários.");
  });

// Deletar usuário selecionado com confirmação
document.getElementById("deleteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = userSelect.value;

  if (!userId) {
    return alert("Selecione um usuário.");
  }

  const confirmDelete = confirm("Tem certeza que deseja excluir este usuário?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:3000/clients/${userId}`, {
      method: "DELETE"
    });

    const result = await response.json();
    if (response.ok) {
      alert("Usuário excluído com sucesso!");
      window.location.href = "../listagem/index.html";
    } else {
      alert(result.message || "Erro ao excluir.");
    }
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    alert("Erro de comunicação com o servidor.");
  }
});
