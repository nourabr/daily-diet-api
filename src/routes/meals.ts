/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { boolean, string, z } from 'zod'
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

  // Edit a meal
  app.put(
    '/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const requestIdSchema = z.object({
        id: z.string().uuid(),
      })

      const requestSchema = z.object({
        name: string(),
        description: string(),
        on_diet: boolean(),
      })

      const { id } = requestIdSchema.parse(request.params)
      const { name, description, on_diet } = requestSchema.parse(request.body)

      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          user_id: sessionId,
          id,
        })
        .update({
          name,
          description,
          on_diet,
        })

      return reply.status(201).send('Meal updated with success!')
    },
  )

  // Delete a meal
  app.delete(
    '/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const requestIdSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = requestIdSchema.parse(request.params)

      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          user_id: sessionId,
          id,
        })
        .del()

      reply.send(`The meal (${id}) has been deleted with success!`)
    },
  )

  // Diet summary
  app.get(
    '/summary',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const dietSummarySchema = z.object({
        total_meals: z.string(),
        on_diet: z.string(),
        off_diet: z.string(),
        best_frequency: z.string(),
      })

      const { sessionId } = request.cookies

      const totalMeals = await knex('meals')
        .where('user_id', sessionId)
        .count('id', { as: 'value' })

      const onDiet = await knex('meals')
        .where({
          user_id: sessionId,
          on_diet: true,
        })
        .count('on_diet', { as: 'value' })

      const offDiet = await knex('meals')
        .where({
          user_id: sessionId,
          on_diet: false,
        })
        .count('on_diet', { as: 'value' })

      const bestFrequency = await knex('meals')
        .where('user_id', sessionId)
        .select('on_diet')

      const frequency: Array<number> = []
      let tmpFrequency = 0

      bestFrequency.forEach((meal) => {
        meal.on_diet ? tmpFrequency++ : (tmpFrequency = 0)
        frequency.push(tmpFrequency)
      })

      const dietSummary = dietSummarySchema.parse({
        total_meals: totalMeals[0].value.toString(),
        on_diet: onDiet[0].value.toString(),
        off_diet: offDiet[0].value.toString(),
        best_frequency: Math.max(...frequency).toString(),
      })

      return reply.send({ dietSummary })
    },
  )
}
