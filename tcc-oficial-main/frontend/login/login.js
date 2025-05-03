var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");
var body = document.querySelector("body");

//obs: não está armazenando o token ainda para futuras requisições

const registerForm = document.querySelectorAll(".form")[0];
const loginForm = document.querySelectorAll(".form")[1];

btnSignin.addEventListener("click", function () {
    body.className = "sign-in-js"; 
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
});

// Register
registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const name = registerForm.querySelector("input[placeholder='Nome']").value;
    const email = registerForm.querySelector("input[placeholder='Email']").value;
    const password = registerForm.querySelector("input[placeholder='Senha']").value;

    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (res.ok) {
            window.location.href = "/frontend/index.html"
        } else {

        }
    } catch (err) {

        console.error(err);
    }
});

// Login
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = loginForm.querySelector("input[placeholder='Email']").value;
    const password = loginForm.querySelector("input[placeholder='Senha']").value;

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            console.log("Token:", data.token); // token a ser salvo no localstorage
            window.location.href = "/frontend/index.html"
        } else {

        }
    } catch (err) {

        console.error(err);
    }
});
