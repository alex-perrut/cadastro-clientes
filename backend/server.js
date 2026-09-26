const express = require("express");
const path = require("path");
require("dotenv").config();

const { conectarBanco } = require("./db/database");
const Cliente = require("./models/Cliente");
const ClienteController = require("./controllers/clienteController");
const criarRotasCliente = require("./routes/clienteRoutes");

const app = express();

const PORT = Number(process.env.PORT || 3000);

const frontendPath = path.join(
    __dirname,
    "..",
    "frontend"
);

const paginaCliente = path.join(
    frontendPath,
    "html",
    "cliente.html"
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos do frontend:
// /css/cliente.css
// /js/cliente.js
// /html/cliente.html
app.use(express.static(frontendPath));

// Página inicial.
app.get("/", (req, res) => {
    res.sendFile(paginaCliente);
});

async function iniciarServidor() {
    try {
        const pool = await conectarBanco();

        // A cada inicialização, a tabela é verificada
        // e criada automaticamente se necessário.
        await Cliente.criarTabela(pool);

        const clienteController =
            new ClienteController(pool);

        app.use(
            "/api/clientes",
            criarRotasCliente(clienteController)
        );

        app.listen(PORT, () => {
            console.log("======================================");
            console.log(
                "Sistema Cadastro de Clientes iniciado"
            );
            console.log(
                `Acesse: http://localhost:${PORT}`
            );
            console.log("MySQL conectado.");
            console.log(
                "Banco 'cliente' verificado/criado."
            );
            console.log(
                "Tabela 'clientes' verificada/criada."
            );
            console.log("======================================");
        });
    } catch (erro) {
        console.error(
            "Não foi possível iniciar o servidor."
        );
        console.error(erro);
        process.exit(1);
    }
}

iniciarServidor();
