class Cliente {
    constructor({
        id = null,
        nome,
        email,
        telefone,
        cidade,
        criado_em = null
    }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cidade = cidade;
        this.criado_em = criado_em;
    }

    static async criarTabela(pool) {
        const sql = `
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                telefone VARCHAR(20) NOT NULL,
                cidade VARCHAR(100) NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;

        await pool.query(sql);
    }

    static async listarTodos(pool) {
        const sql = `
            SELECT
                id,
                nome,
                email,
                telefone,
                cidade,
                criado_em
            FROM clientes
            ORDER BY id DESC
        `;

        const [linhas] = await pool.query(sql);

        return linhas.map(
            (linha) => new Cliente(linha)
        );
    }

    static async buscarPorEmail(pool, email) {
        const sql = `
            SELECT
                id,
                nome,
                email,
                telefone,
                cidade,
                criado_em
            FROM clientes
            WHERE email = ?
            LIMIT 1
        `;

        const [linhas] = await pool.execute(
            sql,
            [email]
        );

        if (linhas.length === 0) {
            return null;
        }

        return new Cliente(linhas[0]);
    }

    static async criar(pool, dados) {
        const cliente = new Cliente(dados);

        const sql = `
            INSERT INTO clientes (
                nome,
                email,
                telefone,
                cidade
            )
            VALUES (?, ?, ?, ?)
        `;

        const [resultado] = await pool.execute(
            sql,
            [
                cliente.nome,
                cliente.email,
                cliente.telefone,
                cliente.cidade
            ]
        );

        cliente.id = resultado.insertId;

        return cliente;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            telefone: this.telefone,
            cidade: this.cidade,
            criado_em: this.criado_em
        };
    }

    static async validarDados(pool, dados) {

        const sql = `
        SELECT
            email,
            password
        FROM login
        WHERE email = ?
        AND password = ?
        LIMIT 1
    `;

        const [linhas] = await pool.execute(
            sql,
            [
                dados.email,
                dados.password
            ]
        );

        if (linhas.length === 0) {
            return null;
        }

        return linhas[0];
    }
}

module.exports = Cliente;
