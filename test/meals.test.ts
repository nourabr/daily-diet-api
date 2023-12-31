import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Meals Route testing', () => {
  beforeAll(() => {
    app.ready()
  })

  afterAll(() => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a user', async () => {
    await request(app.server).get('/meals/create-user').expect(201)
  })

  it('should be able to add a meal', async () => {
    const createUserRequest = await request(app.server)
      .get('/meals/create-user')
      .expect(201)

    const cookie = createUserRequest.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
        on_diet: true,
      })
      .expect(201)
  })

  it('should be able to list meals', async () => {
    const createUserRequest = await request(app.server)
      .get('/meals/create-user')
      .expect(201)

    const cookie = createUserRequest.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
        on_diet: true,
      })
      .expect(201)

    const listRequest = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    expect(listRequest.body.meals).toEqual([
      expect.objectContaining({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
      }),
    ])
  })

  it('should be able to list a meal by id', async () => {
    const createUserRequest = await request(app.server)
      .get('/meals/create-user')
      .expect(201)

    const cookie = createUserRequest.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
        on_diet: true,
      })
      .expect(201)

    const listRequest = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const { id } = listRequest.body.meals[0]

    const listByIdRequest = await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(listByIdRequest.body.meal).toEqual(
      expect.objectContaining({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
      }),
    )
  })

  it('should be able to edit a meal', async () => {
    const createUserRequest = await request(app.server)
      .get('/meals/create-user')
      .expect(201)

    const cookie = createUserRequest.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
        on_diet: true,
      })
      .expect(201)

    const listRequest = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const { id } = listRequest.body.meals[0]

    await request(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookie)
      .send({
        name: 'Almoço',
        description: 'Feijoada',
        on_diet: false,
      })
      .expect(201)
  })

  it('should be able to delete a meal', async () => {
    const createUserRequest = await request(app.server)
      .get('/meals/create-user')
      .expect(201)

    const cookie = createUserRequest.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
        on_diet: true,
      })
      .expect(201)

    const listRequest = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const { id } = listRequest.body.meals[0]

    await request(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', cookie)
      .expect(200)
  })

  it('should be able to summary the diet', async () => {
    const createUserRequest = await request(app.server)
      .get('/meals/create-user')
      .expect(201)

    const cookie = createUserRequest.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, carne cozida',
        on_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
        on_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Sorvete',
        description: '5 bolas com cobertura extra',
        on_diet: false,
      })
      .expect(201)

    const dietSummaryRequest = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookie)
      .expect(200)

    expect(dietSummaryRequest.body.dietSummary).toEqual(
      expect.objectContaining({
        total_meals: 3,
        on_diet: 2,
        off_diet: 1,
        best_frequency: 2,
      }),
    )
  })
})
