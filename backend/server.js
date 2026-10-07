const express = require("express");
const path = require("path");
require("dotenv").config();

const { conectarBanco } = require("./db/database");
const cookieParser = require("cookie-parser");

const Cliente = require("./models/Cliente");

const ClienteController =
    require("./controllers/clienteController");

const criarRotasCliente =
    require("./routes/clienteRoutes");


const app = express();
app.use(cookieParser());

const PORT =
    Number(process.env.PORT || 3000);


// ==========================================
// CAMINHO DO FRONTEND
// ==========================================

const frontendPath = path.join(
    __dirname,
    "..",
    "frontend"
);


const htmlPath = path.join(
    frontendPath,
    "html"
);


const cssPath = path.join(
    frontendPath,
    "css"
);


const jsPath = path.join(
    frontendPath,
    "js"
);


// ==========================================
// MIDDLEWARES
// ==========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// ARQUIVOS CSS
// ==========================================

app.use(
    "/css",
    express.static(cssPath)
);


// ==========================================
// ARQUIVOS JAVASCRIPT
// ==========================================

app.use(
    "/js",
    express.static(jsPath)
);


// ==========================================
// LOGIN
// ==========================================

app.get("/login.html", (req, res) => {

    res.sendFile(
        path.join(
            htmlPath,
            "login.html"
        )
    );

});


// ==========================================
// CADASTRO DE CLIENTES
// ==========================================

app.get("/cliente.html", (req, res) => {

    res.sendFile(
        path.join(
            htmlPath,
            "cliente.html"
        )
    );

});


// ==========================================
// PÁGINA INICIAL
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            htmlPath,
            "login.html"
        )
    );

});


// ==========================================
// BANCO DE DADOS E ROTAS
// ==========================================

async function iniciarServidor() {

    try {

        const pool =
            await conectarBanco();


        // Cria a tabela se não existir

        await Cliente.criarTabela(pool);


        // Controller

        const clienteController =
            new ClienteController(pool);


        // Rotas dos clientes

        app.use(
            "/api/clientes",
            criarRotasCliente(
                clienteController
            )
        );


        // ==================================
        // INICIA O SERVIDOR
        // ==================================

        app.listen(
            PORT,
            () => {

                console.log(
                    "======================================"
                );

                console.log(
                    "Sistema Cadastro de Clientes iniciado"
                );

                console.log(
                    `Acesse: http://localhost:${PORT}`
                );

                console.log(
                    `Login: http://localhost:${PORT}/login.html`
                );

                console.log(
                    `Clientes: http://localhost:${PORT}/cliente.html`
                );

                console.log(
                    "MySQL conectado."
                );

                console.log(
                    "Banco 'cliente' verificado/criado."
                );

                console.log(
                    "Tabela 'clientes' verificada/criada."
                );

                console.log(
                    "======================================"
                );

            }
        );

    } catch (erro) {

        console.error(
            "Não foi possível iniciar o servidor."
        );

        console.error(erro);

        process.exit(1);

    }

}


iniciarServidor();

