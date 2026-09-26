# Cadastro de Clientes

Projeto completo de cadastro de clientes com:

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL
- Modelo orientado a objetos

## Estrutura correta

```text
cadastro-de-clientes/
│
├── frontend/
│   ├── html/
│   │   └── cliente.html
│   ├── css/
│   │   └── cliente.css
│   └── js/
│       └── cliente.js
│
├── backend/
│   ├── controllers/
│   │   └── clienteController.js
│   ├── models/
│   │   └── Cliente.js
│   ├── db/
│   │   └── database.js
│   ├── routes/
│   │   └── clienteRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── .gitignore
```

## Como executar

### 1. Inicie o MySQL

O serviço MySQL precisa estar funcionando.

### 2. Entre no backend

```bash
cd cadastro-de-clientes/backend
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor

```bash
npm start
```

### 5. Abra no navegador

```text
http://localhost:3000
```

O servidor entrega automaticamente:

```text
/
→ frontend/html/cliente.html

/css/cliente.css
→ frontend/css/cliente.css

/js/cliente.js
→ frontend/js/cliente.js
```

## Comportamento do formulário

No início somente `Nome` fica habilitado.

A sequência é:

```text
Nome → E-mail → Telefone → Cidade
```

Ao preencher corretamente o campo atual, o próximo campo é liberado.

Quando os quatro campos estiverem válidos, o botão `Cadastrar` é habilitado.

Após o cadastro:

- os dados são enviados para o backend;
- o cliente é gravado no MySQL;
- a listagem é atualizada;
- o formulário é reiniciado;
- somente Nome volta a ficar habilitado;
- o botão Cadastrar volta a ficar desabilitado.

A API impede cadastro duplicado pelo mesmo e-mail.

## Banco e criação automática

As credenciais usadas são:

```text
Banco: cliente
Usuário: root
Senha: leco1109
Porta: 3306
```

No início do servidor, o backend verifica/cria o banco.

Depois verifica/cria automaticamente:

```sql
CREATE TABLE IF NOT EXISTS clientes (...)
```

## Observação

O arquivo `.env` foi incluído para facilitar a execução local deste exercício.
Em um projeto real, não é recomendado colocar senha de banco no Git.
