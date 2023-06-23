import { app } from './app'

app
  .listen({
    path: 'http://localhost',
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running...')
  })
