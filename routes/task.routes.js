const verifyToken = require("../auth/verifyToken");
const {v4: uuidv4} = require('uuid');
const {getTask, createTask, deleteTask, updateTask} = require('../schema/task.schema');

const taskRoutes = (fastify, options, done) => {
  fastify.register(require('fastify-auth')).after(() => privateRoutes(fastify, options, done));

  done();
};

const privateRoutes = (fastify, options, done) => {
  fastify.route({
    method: "GET",
    url: '/api/project/tasks/:id',
    preHandler: fastify.auth([verifyToken]),
    scema: getTask,
    handler: async (req, reply) => {
      const project_id = req.params.id
      fastify.pg.query(
        'SELECT * FROM task WHERE project_id = $1', [project_id],
        function onResult(err, result) {
          reply.send(err || result.rows)
        }
      )
    }
  })

  fastify.route({
    method: "POST",
    url: '/api/tasks',
    preHandler: fastify.auth([verifyToken]),
    scema: createTask,
    handler: async (req, reply) => {
      const {task_name, project_id} = req.body;
      const user_id = req.user.id.id;
      const id = uuidv4();

      const create_date = new Date().toISOString();
      const update_date = create_date;
      const time = 0;

      fastify.pg.query(
        `INSERT INTO task(id, task_name, project_id, user_id, create_date, update_date, time)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`, [id, task_name, project_id, user_id, create_date, update_date, time],
        function onResult(err, result) {
          if (err) reply.send(err)
          reply.code(201)
          reply.send(result.rows[0])
        }
      )
    }
  })

  fastify.route({
    method: "DELETE",
    url: '/api/task/:id',
    preHandler: fastify.auth([verifyToken]),
    schema: deleteTask,
    handler: async (req, reply) => {
      const id = req.params.id
      fastify.pg.query(
        'DELETE FROM task WHERE id = $1 RETURNING *', [id],
        function onResult(err, result) {
          if (err) reply.send(err)
          reply.send({deleted: true})
        }
      )
    }
  })

  fastify.route({
    method: "PUT",
    url: '/api/task/:id',
    preHandler: fastify.auth([verifyToken]),
    schema: updateTask,
    handler: async (req, reply) => {
      const {task_name,} = req.body
      const id = req.params.id
      const update_date = new Date().toISOString();

      fastify.pg.query(
        'UPDATE task SET task_name=$1, update_date=$2 WHERE id=$3', [task_name, update_date, id],
        function onResult(err, result) {
          if (err) reply.send(err)
          reply.code(201);
          reply.send({updated: true});
        }
      )
    }
  })
};

module.exports = taskRoutes;
