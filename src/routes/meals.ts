/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middleware/checkSessionIdExists'

export async function mealsRoutes(app: FastifyInstance) {
  // Create a user using session ID
  app.get('/create-user', async (request, reply) => {
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

  // Add a meal
  app.post(
    '/',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const requestBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        on_diet: z.boolean(),
      })

      const { sessionId } = request.cookies

      const { name, description, on_diet } = requestBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        user_id: sessionId,
        name,
        description,
        created_at: new Date().toLocaleString('pt-BR'),
        on_diet,
      })

      return reply.status(201).send('Meal added with success!')
    },
  )

  // List meals
  app.get('/', { preHandler: checkSessionIdExists }, async (request) => {
    const { sessionId } = request.cookies

    const meals = await knex('meals').where('user_id', sessionId).select()

    return { meals }
  })

  // List meal by id
  app.get('/:id', { preHandler: checkSessionIdExists }, async (request) => {
    const requestIdSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = requestIdSchema.parse(request.params)

    const { sessionId } = request.cookies

    const meal = await knex('meals')
      .where({
        user_id: sessionId,
        id,
      })
      .select()
      .first()

    return { meal }
  })
}
