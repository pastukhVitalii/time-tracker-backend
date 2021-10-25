const {v4: uuidv4} = require('uuid');
const {getTask, createTask, deleteTask, updateTask} = require('../schema/task.schema');

const taskRoutes = (fastify, options, done) => {
  fastify.get('/api/tasks', getTask, async (req, reply) => {
    fastify.pg.query(
      'SELECT * FROM task',
      function onResult(err, result) {
        reply.send(err || result.rows)
      }
    )
  })

  fastify.post('/api/tasks', createTask, async (req, reply) => {
    const {task_name, project_id, user_id} = req.body;
    const id = uuidv4();

    const create_date = new Date().toISOString();
    const update_date = create_date;
    const time = 0;

    fastify.pg.query(
      `INSERT INTO task(id, task_name, project_id, user_id, create_date, update_date, time)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [id, task_name, project_id, user_id, create_date, update_date, time],
      function onResult(err, result) {
        if (err) reply.send(err)
        reply.code(201)
        reply.send(result.rows[0])
      }
    )
  })

  fastify.delete('/api/task/:id', deleteTask, async (req, reply) => {
    const id = req.params.id
    fastify.pg.query(
      'DELETE FROM task WHERE id = $1 RETURNING *', [id],
      function onResult(err, result) {
        if (err) reply.send(err)
        reply.send({deleted: true})
      }
    )
  })

  fastify.put('/api/task/:id', updateTask, async (req, reply) => {
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
  })

  done();
};

module.exports = taskRoutes;
