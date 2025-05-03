// Pegando o select já presente no HTML
const userSelect = document.getElementById("userSelect");

// Busca e preenche a combobox com todos os usuários
fetch("http://localhost:3000/clients")
  .then(response => response.json())
  .then(users => {
    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `${user.name} (${user.email})`;
      userSelect.appendChild(option);
    });

    // Preenche os dados do primeiro usuário automaticamente
    if (users.length > 0) {
      fillForm(users[0]);
    }

    // Ao mudar de usuário na combobox
    userSelect.addEventListener("change", () => {
      const selectedUser = users.find(u => u.id == userSelect.value);
      if (selectedUser) {
        fillForm(selectedUser);
      }
    });
  })
  .catch(err => {
    console.error("Erro ao carregar usuários:", err);
    alert("Erro ao buscar usuários.");
  });

// Preenche os campos do formulário com os dados do usuário selecionado
function fillForm(user) {
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  document.getElementById("password").value = "";
}

// Submissão do formulário
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = userSelect.value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!userId || !password) {
    return alert("Selecione um usuário e digite uma nova senha.");
  }

  try {
    const response = await fetch(`http://localhost:3000/clients/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Usuário atualizado com sucesso!");
      window.location.href = "../listagem/index.html";
    } else {
      alert(result.message || "Erro ao atualizar.");
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao enviar dados.");
  }
});

//MenuBar

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".feedback-card")
  const img1 = elements[0]
  const img2 = elements[1]
  const img3 = elements[2]

  const feedbacksSection = document.querySelector(".feedbacks");

  let sectionTop = 0;
  let inView = false
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              sectionTop = window.scrollY;
              inView=true
              // Stop observing after first intersection
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0 });

  observer.observe(feedbacksSection);

  window.addEventListener('scroll', () => {
      if(!inView){
          return
      }
      const scrollY = window.scrollY - sectionTop;    
      console.log(scrollY);
      // Adjust these multipliers for different speeds
      img1.style.transform = `translateY(${scrollY * -0.6}px)`;
      img2.style.transform = `translateY(${scrollY * -0.4}px)`;
      img3.style.transform = `translateY(${scrollY * -0.2}px)`;
  });
});




