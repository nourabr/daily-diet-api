import fastify from 'fastify'
import { mealsRoutes } from './routes/meals'

const app = fastify()

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
