const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");
const senha = document.getElementById("senha");

const mostrarSenha = document.getElementById("mostrarSenha");

const erroEmail = document.getElementById("erroEmail");
const erroSenha = document.getElementById("erroSenha");

const mensagem = document.getElementById("mensagem");

mostrarSenha.addEventListener("click", function () {

    if (senha.type === "password") {

        senha.type = "text";
        mostrarSenha.textContent = "🙈";

    } else {

        senha.type = "password";
        mostrarSenha.textContent = "👁";

    }

});

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    erroEmail.textContent = "";
    erroSenha.textContent = "";
    mensagem.textContent = "";

    const valorEmail = email.value.trim();
    const valorSenha = senha.value;

    if (valorEmail === "") {

        erroEmail.textContent = "Digite seu e-mail.";

        email.focus();

        return;
    }


    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(valorEmail)) {

        erroEmail.textContent = "Digite um e-mail válido.";

        email.focus();

        return;
    }

    if (valorSenha === "") {

        erroSenha.textContent = "Digite sua senha.";

        senha.focus();

        return;
    }


    if (valorSenha.length !== 6) {

        erroSenha.textContent =
            "A senha deve possuir 6 caracteres.";

        senha.focus();

        return;
    }

    try {

        mensagem.style.color = "black";

        mensagem.textContent = "Verificando login...";


        const resposta = await fetch("/api/clientes/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({

                email: valorEmail,

                password: valorSenha

            })

        });

        const dados = await resposta.json();


        if (resposta.ok) {

            mensagem.style.color = "green";

            mensagem.textContent =
                dados.mensagem ||
                "Login realizado com sucesso!";


            setTimeout(function () {

                window.location.href = "./cliente.html";

            }, 1000);


        } else {

            mensagem.style.color = "red";

            mensagem.textContent =
                dados.mensagem ||
                "E-mail ou senha incorretos.";

        }


    } catch (erro) {

        console.error(
            "Erro ao realizar login:",
            erro
        );

        mensagem.style.color = "red";

        mensagem.textContent =
            "Não foi possível conectar ao servidor.";

    }

});