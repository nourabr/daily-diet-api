# Daily Diet API


# Requisitos funcionais

  - [] Criar um usuário
  - [] Registrar uma refeição feita com:
        { 
          nome,
          descrição,
          data,
          dentro da dieta (bool)? 
        }
  - [] Editar uma refeição
  - [] Apagar uma refeição
  - [] Listar todas refeições
  - [] Visualizar uma única refeição
  - [] Recuperar métrica do usuário com: 
        {
          total de refeições,
          refeições dentro da dieta,
          fora,
          melhor frequência de refeições dentro da dieta;
        }


# Regras de negócio

  - [] Deve ser possível identificar o usuário entre as requisições
  - [] O usuário só pode visualizar, editar e apagar as refeições dele 




# Requisitos técnicos (não funcionais)

  - [] Fazer o deploy com o render.com
  - [] Dependencias globais 
      {
        fastify, @fastify/cookie,
        knex,
        dotenv,
        pg,
        zod
      }
  - [] Dependencias de desenvolvimento
      {
        @rocketseat/eslint-config,
        @types/node,
        @types/supertest,
        eslint,
        supertest,
        tsup,
        tsx,
        typescript,
        vitest,
        sqlite3
      }
  - [] Testes automatizados e2e em todas as rotas
  - [] Migrations
  - [] Variáveis de ambiente