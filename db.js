const fastifyPlugin = require('fastify-plugin')
const {Client} = require('pg')
require('dotenv').config()

const client = new Client({
  user: 'postgres',
  password: 'postFIB011235',
  host: 'localhost',
  port: 5432,
  database: 'time-tracker'
})

async function dbconnector(fastify, options) {
  try {
    await client.connect()
    console.log("db connected successfully")
    fastify.decorate('db', {client})
  } catch (err) {
    console.error(err)
  }
}

module.exports = fastifyPlugin(dbconnector)
