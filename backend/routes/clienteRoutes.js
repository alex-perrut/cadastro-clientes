const express = require("express");

const autenticar = require("../middleware/autenticar");

function criarRotasCliente(controller) {

    const router = express.Router();

    // =====================================
    // ROTA PÚBLICA
    // =====================================

    router.post(
        "/login",
        controller.login.bind(controller)
    );


    // =====================================
    // ROTAS PROTEGIDAS
    // =====================================

    router.use(autenticar);


    // Logout precisa estar autenticado
    router.post(
        "/logout",
        controller.logout.bind(controller)
    );


    // Suas outras rotas de clientes ficam aqui
    // Exemplo:

    router.get(
        "/",
        controller.listar.bind(controller)
    );


    router.post(
        "/",
        controller.cadastrar.bind(controller)
    );


    return router;
}

module.exports = criarRotasCliente;
