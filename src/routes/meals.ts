import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const result = await knex('meals').select()

    return result
  })
}
