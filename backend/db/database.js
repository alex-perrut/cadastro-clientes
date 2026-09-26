const mysql = require("mysql2/promise");
require("dotenv").config();

const configuracao = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
};

function validarNomeBanco(nome) {
    if (!/^[A-Za-z0-9_]+$/.test(nome)) {
        throw new Error(
            "O nome do banco possui caracteres inválidos."
        );
    }
}

async function criarBancoSeNaoExistir() {
    validarNomeBanco(configuracao.database);

    const conexao = await mysql.createConnection({
        host: configuracao.host,
        user: configuracao.user,
        password: configuracao.password,
        port: configuracao.port
    });

    try {
        await conexao.query(
            `CREATE DATABASE IF NOT EXISTS \`${configuracao.database}\`
             CHARACTER SET utf8mb4
             COLLATE utf8mb4_unicode_ci`
        );
    } finally {
        await conexao.end();
    }
}

async function conectarBanco() {
    await criarBancoSeNaoExistir();

    const pool = mysql.createPool({
        ...configuracao,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    await pool.query("SELECT 1");

    return pool;
}

module.exports = {
    conectarBanco
};
