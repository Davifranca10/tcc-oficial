
const formCadastro = document.getElementById("formCadastro");

var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");

var body = document.querySelector("body");


btnSignin.addEventListener("click", function () {
   body.className = "sign-in-js"; 
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
})

formCadastro.addEventListener("submit", async function(e) {
  e.preventDefault();

  const dados = new FormData(e.target);
  const cliente = Object.fromEntries(dados.entries());

  const resposta = await fetch("http://localhost:3000/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });

  const resultado = await resposta.json();
  alert(resultado.mensagem || "Erro ao cadastrar");
  formCadastro.reset();
});
