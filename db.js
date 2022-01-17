const fastifyPlugin = require('fastify-plugin')
const {Client} = require('pg')
require('dotenv').config()

const client = new Client({
  /*user: 'igwkebqvuycnps',
  password: 'e94361797b63028534182803cb1ccbec50d55c36127fc5589da3461c6f571ab6',
  host: 'ec2-63-34-223-144.eu-west-1.compute.amazonaws.com',
  port: 5432,
  database: 'dfqph5430holfa',*/

  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
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
