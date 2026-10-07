const form = document.getElementById("clienteForm");
const btnLogout = document.getElementById("btnLogout");

const nome = document.getElementById("nome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const cidade = document.getElementById("cidade");

const btnCadastrar = document.getElementById("btnCadastrar");
const listaClientes = document.getElementById("listaClientes");
const mensagem = document.getElementById("mensagem");

const campos = [nome, email, telefone, cidade];

const erros = {
    nome: document.getElementById("erroNome"),
    email: document.getElementById("erroEmail"),
    telefone: document.getElementById("erroTelefone"),
    cidade: document.getElementById("erroCidade")
};

async function verificarLogin() {

    try {

        const resposta = await fetch("/api/clientes", {

            method: "GET",

            credentials: "include"

        });


        if (resposta.status === 401) {

            window.location.href = "./login.html";

            return;
        }


        if (!resposta.ok) {

            console.error(
                "Erro ao verificar autenticação."
            );

            return;
        }

        console.log("Usuário autenticado.");

    } catch (erro) {

        console.error(
            "Erro ao verificar login:",
            erro
        );
        window.location.href = "./login.html";
    }
}

verificarLogin();

function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}


function validarTelefone(valor) {
    let somenteNumeros = valor.replace(/\D/g, "");

    somenteNumeros = somenteNumeros.substring(0, 11);

    if (somenteNumeros.length <= 2) {
        return somenteNumeros.replace(/^(\d{0,2})/, "($1");
    }

    if (somenteNumeros.length <= 7) {
        return somenteNumeros.replace(
            /^(\d{2})(\d{0,5})/,
            "($1) $2"
        );
    }

    return somenteNumeros.replace(
        /^(\d{2})(\d{5})(\d{0,4})/,
        "($1) $2-$3"
    );
}
function campoValido(campo) {
    const valor = campo.value.trim();

    if (campo === nome) {
        return valor.length >= 3;
    }

    if (campo === email) {
        return validarEmail(valor);
    }

    if (campo === telefone) {
        return validarTelefone(valor);
    }

    if (campo === cidade) {
        return valor.length >= 2;
    }

    return false;
}

function obterMensagemErro(campo) {
    const valor = campo.value.trim();

    if (!valor) {
        return "Preencha conforme o exemplo acima.";
    }

    if (campo === nome && valor.length < 3) {
        return "Digite pelo menos 3 caracteres.";
    }

    if (campo === email && !validarEmail(valor)) {
        return "Digite um e-mail válido.";
    }

    if (campo === telefone && !validarTelefone(valor)) {
        return "Digite um telefone válido.";
    }

    if (campo === cidade && valor.length < 2) {
        return "Digite uma cidade válida.";
    }

    return "";
}

function mostrarErro(campo) {
    const mensagemErro = obterMensagemErro(campo);
    erros[campo.id].textContent = mensagemErro;
    campo.classList.toggle("invalido", Boolean(mensagemErro));
}

function limparErro(campo) {
    erros[campo.id].textContent = "";
    campo.classList.remove("invalido");
}

function bloquearCamposDepois(indice) {
    for (let i = indice + 1; i < campos.length; i += 1) {
        campos[i].value = "";
        campos[i].disabled = true;
        limparErro(campos[i]);
    }
}

function atualizarEtapas() {
    for (let i = 1; i < campos.length; i += 1) {
        const campoAnterior = campos[i - 1];

        if (campoValido(campoAnterior)) {
            campos[i].disabled = false;
        } else {
            campos[i].disabled = true;
            campos[i].value = "";
            limparErro(campos[i]);
        }
    }

    btnCadastrar.disabled = !campos.every(campoValido);
}

function limparMensagem() {
    mensagem.textContent = "";
    mensagem.className = "mensagem";
}

telefone.addEventListener("input", function () {
    telefone.value = validarTelefone(telefone.value);
});

campos.forEach((campo, indice) => {
    campo.addEventListener("input", () => {
        mostrarErro(campo);

        if (!campoValido(campo)) {
            bloquearCamposDepois(indice);
        }

        atualizarEtapas();
        limparMensagem();
    });

    campo.addEventListener("blur", () => {
        if (!campo.disabled) {
            mostrarErro(campo);
        }
    });
});

async function carregarClientes() {
    try {
        const resposta = await fetch("/api/clientes");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os clientes.");
        }

        const clientes = await resposta.json();

        listaClientes.innerHTML = "";

        if (clientes.length === 0) {
            listaClientes.innerHTML = `
                <tr>
                    <td colspan="4" class="sem-dados">
                        Nenhum cliente cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        clientes.forEach((cliente) => {
            const linha = document.createElement("tr");

            const colunaNome = document.createElement("td");
            colunaNome.textContent = cliente.nome;

            const colunaEmail = document.createElement("td");
            colunaEmail.textContent = cliente.email;

            const colunaTelefone = document.createElement("td");
            colunaTelefone.textContent = cliente.telefone;

            const colunaCidade = document.createElement("td");
            colunaCidade.textContent = cliente.cidade;

            linha.append(
                colunaNome,
                colunaEmail,
                colunaTelefone,
                colunaCidade
            );

            listaClientes.appendChild(linha);
        });
    } catch (erro) {
        console.error(erro);

        listaClientes.innerHTML = `
            <tr>
                <td colspan="4" class="sem-dados">
                    Erro ao carregar os clientes.
                </td>
            </tr>
        `;
    }
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!campos.every(campoValido)) {
        campos.forEach((campo) => {
            if (!campo.disabled) {
                mostrarErro(campo);
            }
        });

        atualizarEtapas();
        return;
    }

    btnCadastrar.disabled = true;
    mensagem.textContent = "Salvando cliente...";
    mensagem.className = "mensagem";

    const cliente = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        telefone: telefone.value.trim(),
        cidade: cidade.value.trim()
    };

    try {
        const resposta = await fetch("/api/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || "Erro ao cadastrar cliente."
            );
        }

        mensagem.textContent = dados.mensagem;
        mensagem.className = "mensagem sucesso";

        form.reset();

        campos.forEach((campo, indice) => {
            campo.disabled = indice !== 0;
            limparErro(campo);
        });

        btnCadastrar.disabled = true;

        await carregarClientes();
        nome.focus();
    } catch (erro) {
        console.error(erro);

        mensagem.textContent = erro.message;
        mensagem.className = "mensagem erro-mensagem";

        atualizarEtapas();
    }
});

btnLogout.addEventListener("click", async function () {

    try {

        const resposta = await fetch("/api/clientes/logout", {

            method: "POST"

        });

        const dados = await resposta.json();

        if (resposta.ok) {

            window.location.href = "./login.html";

        }

    } catch (erro) {

        console.error("Erro ao fazer logout:", erro);

    }

});

nome.focus();
carregarClientes();
