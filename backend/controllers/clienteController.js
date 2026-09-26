const Cliente = require("../models/Cliente");

class ClienteController {
    constructor(pool) {
        this.pool = pool;
    }

    validarDados(dados) {
        const erros = [];

        const nome = String(dados.nome || "").trim();
        const email = String(dados.email || "").trim().toLowerCase();
        const telefone = String(dados.telefone || "").trim();
        const cidade = String(dados.cidade || "").trim();

        if (nome.length < 3 || nome.length > 100) {
            erros.push("O nome deve ter entre 3 e 100 caracteres.");
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValido || email.length > 150) {
            erros.push("Informe um e-mail válido.");
        }

        const telefoneNumeros = telefone.replace(/\D/g, "");

        if (
            telefoneNumeros.length < 8 ||
            telefoneNumeros.length > 15
        ) {
            erros.push("Informe um telefone válido.");
        }

        if (cidade.length < 2 || cidade.length > 100) {
            erros.push(
                "A cidade deve ter entre 2 e 100 caracteres."
            );
        }

        return {
            erros,
            cliente: {
                nome,
                email,
                telefone,
                cidade
            }
        };
    }

    async listar(req, res) {
        try {
            const clientes = await Cliente.listarTodos(this.pool);

            return res.status(200).json(
                clientes.map((cliente) => cliente.toJSON())
            );
        } catch (erro) {
            console.error("Erro ao listar clientes:", erro);

            return res.status(500).json({
                mensagem: "Erro interno ao listar os clientes."
            });
        }
    }

    async cadastrar(req, res) {
        const { erros, cliente } = this.validarDados(req.body);

        if (erros.length > 0) {
            return res.status(400).json({
                mensagem: "Dados inválidos.",
                erros
            });
        }

        try {
            const clienteExistente =
                await Cliente.buscarPorEmail(
                    this.pool,
                    cliente.email
                );

            if (clienteExistente) {
                return res.status(409).json({
                    mensagem:
                        "Já existe um cliente cadastrado com este e-mail."
                });
            }

            const novoCliente = await Cliente.criar(
                this.pool,
                cliente
            );

            return res.status(201).json({
                mensagem: "Cliente cadastrado com sucesso.",
                cliente: novoCliente.toJSON()
            });
        } catch (erro) {
            console.error(
                "Erro ao cadastrar cliente:",
                erro
            );

            return res.status(500).json({
                mensagem:
                    "Erro interno ao cadastrar o cliente."
            });
        }
    }
}

module.exports = ClienteController;
