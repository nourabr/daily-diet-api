import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  // Create a user using session ID
  app.get('/create-user', (request, reply) => {
    let { sessionId } = request.cookies

    let feedback = 'Account created with success!'
    let statusCode = 201

    if (!sessionId) {
      sessionId = randomUUID()
    } else {
      feedback = `You are already logged in as: ${sessionId}`
      statusCode = 200
    }

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(statusCode).send(feedback)
  })

  app.get('/', async (request, reply) => {
    const result = await knex('meals').select()

    return result
  })
}
