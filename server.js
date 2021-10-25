const fastify = require('fastify')({logger: true})
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: {title: 'fastify-api'},
  },
})

fastify.register(require('fastify-cors'), {
  // put your options here
  origin: true
})

const dbconnector = require('./db')
fastify.register(dbconnector)

fastify.register(require('./routes/users'))
fastify.register(require('./routes/project.routes'))
fastify.register(require('./routes/task.routes'))

fastify.register(require('fastify-postgres'), {
  connectionString: 'postgres://postgres:postFIB011235@localhost:5432/time-tracker'
})

const PORT = 5000;

const start = async () => {
  try {
    await fastify.listen(PORT)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
