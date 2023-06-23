import fastify from "fastify";

const app = fastify()

app.get('/meals', async () => {
  console.log('You are on /meals')
})

.listen({
  path: 'http://localhost',
  port: 3333
}) .then(()=>{
  console.log('HTTP Server Running...')
})