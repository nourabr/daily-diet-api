import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'child_process'
import { number } from 'zod'

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
    request(app.server).get('/meals/create-user').expect(201)
    request(app.server).get('/meals/create-user').expect(200)
  })

  it('should be able to add a meal', async () => {
    const createUserRequest = request(app.server)
      .get('/meals/create-user')
      .expect(201)

    const cookie = createUserRequest.get('setCookie')

    request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
        on_diet: true,
      })
      .expect(201)

    expect.stringContaining('Meal added with sucess!')
  })

  it('should be able to list meals', async () => {
    const createUserRequest = request(app.server)
      .get('/meals/create-user')
      .expect(201)

    const cookie = createUserRequest.get('setCookie')

    request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'Janta',
        description: 'Arroz, feijão, ovos cozidos',
        on_diet: true,
      })
      .expect(201)

    request(app.server).get('/meals').expect(200)

    expect.objectContaining({
      meals: [
        {
          name: 'Janta',
          description: 'Arroz, feijão, ovos cozidos',
          on_diet: true,
        },
      ],
    })
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

    await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookie)
      .expect(200)

    expect.objectContaining({
      meals: [
        {
          id,
          name: 'Janta',
          description: 'Arroz, feijão, ovos cozidos',
          on_diet: true,
        },
      ],
    })
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

    expect.objectContaining({
      meals: [
        {
          id,
          name: 'Almoço',
          description: 'Feijoada',
          on_diet: false,
        },
      ],
    })
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

    expect.stringContaining(`The meal (${id}) has been deleted with success!`)
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

    await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookie)
      .expect(200)
  })
})
