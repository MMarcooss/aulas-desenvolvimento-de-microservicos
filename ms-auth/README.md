# MS-Auth

Microserviço de Autenticação e Usuários - NestJS com Clean Architecture.

## Stack

- NestJS 11.x
- TypeScript
- PostgreSQL + Drizzle ORM
- JWT
- bcryptjs

## Estrutura

```
src/
├── modules/
│   ├── auth/          # Autenticação (login, JWT, guards)
│   └── users/         # Gerenciamento de usuários
├── shared/            # Infraestrutura compartilhada
│   ├── infra/
│   │   ├── database/  # Drizzle + schemas
│   │   └── decorators/# Decorators (@Public)
│   └── types/         # Tipos globais
└── main.ts
```

## Endpoints

### Auth

| Método | Endpoint        | Descrição              | Público |
|--------|-----------------|------------------------|---------|
| POST   | /api/auth/login | Login (email/senha)    | Sim     |
| GET    | /api/auth/validate | Valida token JWT     | Sim     |

### Users

| Método | Endpoint        | Descrição              |
|--------|-----------------|------------------------|
| POST   | /api/users      | Criar usuário          |
| GET    | /api/users      | Listar usuários        |
| GET    | /api/users/:id  | Buscar usuário         |
| PATCH  | /api/users/:id  | Atualizar usuário      |
| DELETE | /api/users/:id  | Remover usuário        |

## Configuração

1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure o banco de dados no Docker:
   ```bash
   docker compose up -d postgres
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Rode as migrações:
   ```bash
   npm run db:push
   ```

5. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

## Docker Compose

Inicie tudo (PostgreSQL + API):
```bash
docker compose up -d
```

## Porta

Por padrão roda na porta **3001**.
