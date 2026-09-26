const express = require("express");

function criarRotasCliente(controller) {
    const router = express.Router();

    router.get("/", controller.listar.bind(controller));
    router.post("/", controller.cadastrar.bind(controller));

    return router;
}

module.exports = criarRotasCliente;
