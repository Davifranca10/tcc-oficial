document.addEventListener("DOMContentLoaded", () => {
    
    fetch("http://localhost:3000/clients")
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector("#userTable tbody");
        data.forEach(user => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.telefone}</td>
            <td>${user.email}</td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Erro ao buscar usuários:", err);
        alert("Erro ao carregar usuários.");
      });
  
    document.getElementById("editBtn").addEventListener("click", () => {
      alert("Função editar ainda não implementada.");
    });
  
    document.getElementById("deleteBtn").addEventListener("click", () => {
      alert("Função deletar ainda não implementada.");
    });
  });

  // Adiciona seleção de linha na tabela
document.querySelector("#userTable tbody").addEventListener("click", (e) => {
    const rows = document.querySelectorAll("#userTable tbody tr");
    rows.forEach(r => r.classList.remove("selected"));
  
    const selectedRow = e.target.closest("tr");
    if (selectedRow) {
      selectedRow.classList.add("selected");
    }
  });
  
  // Redireciona para a tela de edição com o ID do usuário selecionado
  document.getElementById("editBtn").addEventListener("click", () => {
    const selected = document.querySelector("tr.selected");
    if (!selected) {
      return alert("Selecione um usuário para editar.");
    }
  
    const userId = selected.children[0].textContent; // coluna ID
    window.location.href = `../editar/index.html?id=${userId}`;
  });

  //MENUBAR

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