const btnSignin = document.querySelector("#signin");
const btnSignup = document.querySelector("#signup");
const body = document.querySelector("body");

btnSignin.addEventListener("click", function () {
    body.className = "sign-in-js";
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
});

// Cadastro de usuário
const registerForm = document.querySelector("#registerForm");

registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("senha").value.trim();

    if (!name || !telefone || !email || !password) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, telefone, email, password })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "/frontend/index.html";
        } else {
            alert(data.message || "Erro ao cadastrar.");
        }
    } catch (err) {
        console.error("Erro ao enviar dados:", err);
        alert("Erro interno no servidor.");
    }
});

// Login de usuário
const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginSenha").value.trim();

    if (!email || !password) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            console.log("Token:", data.token); // Salve se necessário
            window.location.href = "/frontend/index.html";
        } else {
            alert(data.message || "Email ou senha inválidos.");
        }
    } catch (err) {
        console.error("Erro no login:", err);
        alert("Erro ao fazer login.");
    }
});