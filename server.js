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

fastify.register(require('./routes/users.routes'))
fastify.register(require('./routes/project.routes'))
fastify.register(require('./routes/task.routes'))

fastify.register(require('fastify-postgres'), {
  connectionString: process.env.DATABASE_URL
})

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    /*prod*/  await fastify.listen(PORT, '0.0.0.0');
    /*dev*/ // await fastify.listen(PORT)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
