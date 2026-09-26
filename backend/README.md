# Backend - Cadastro de Clientes

## Instalação

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Inicie:

```bash
npm start
```

Para desenvolvimento:

```bash
npm run dev
```

## Banco

Configuração atual:

```text
Host: localhost
Usuário: root
Senha: leco1109
Porta: 3306
Banco: cliente
```

O backend cria automaticamente o banco `cliente` se ele não existir.

Depois o model `Cliente` executa `CREATE TABLE IF NOT EXISTS`
para criar/verificar a tabela `clientes` a cada inicialização.

## Rotas

```text
GET  /api/clientes
POST /api/clientes
```
