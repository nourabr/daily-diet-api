import fastify from 'fastify'
import { mealsRoutes } from './routes/meals'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
app
  .register(mealsRoutes, {
    prefix: '/meals',
  })

  .listen({
    path: 'http://localhost',
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running...')
  })
