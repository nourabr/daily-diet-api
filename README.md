# Daily Diet API
O objetivo deste projeto é criar uma API para um aplicativo de dieta pessoal.  

# Requisitos funcionais

  - [x] Criar um usuário
  - [x] Registrar uma refeição feita com:
        { 
          nome,
          descrição,
          data,
          dentro da dieta (bool)? 
        }
  - [x] Editar uma refeição
  - [x] Apagar uma refeição
  - [x] Listar todas refeições
  - [x] Visualizar uma única refeição
  - [ ] Recuperar métricas do usuário com {
          total de refeições,
          refeições dentro da dieta,
          fora,
          melhor frequência de refeições dentro da dieta;
        }


# Regras de negócio

  - [x] Deve ser possível identificar o usuário entre as requisições
  - [x] O usuário só pode visualizar, editar e apagar as refeições dele 




# Requisitos técnicos (não funcionais)

  - [x] Migrations
  - [x] Variáveis de ambiente
  - [x] Dependencias globais {
        fastify, @fastify/cookie,
        knex,
        dotenv,
        pg,
        zod
      } 
  - [x] Dependencias de desenvolvimento {
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
  - [x] Testes automatizados e2e em todas as rotas
  - [ ] Fazer o deploy com o render.com
      
      