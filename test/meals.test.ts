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
})
