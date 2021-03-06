const verifyToken = require("../auth/verifyToken");
const {v4: uuidv4} = require('uuid');
const {getProjects, createProject, deleteProject, updateProject} = require('../schema/project.schema');

const projectRoutes = (fastify, options, done) => {
  fastify.register(require('fastify-auth')).after(() => privateRoutes(fastify, options, done));

  done();
};

const privateRoutes = (fastify, options, done) => {
  fastify.route({
    method: "GET",
    url: '/api/projects/:id',
    preHandler: fastify.auth([verifyToken]),
    schema: getProjects,
    handler: async (req, reply) => {
      const user_id = req.params.id
      fastify.pg.query(
        'SELECT * FROM project WHERE user_id = $1', [user_id],
        function onResult(err, result) {
          reply.send(err || result.rows.reverse());
        }
      )
    }
  })

  fastify.route({
    method: "POST",
    url: '/api/projects',
    preHandler: fastify.auth([verifyToken]),
    schema: createProject,
    handler: async (req, reply) => {
      const {projectName} = req.body;
      const user_id = req.user.user.id;
      const id = uuidv4();

      const createdate = new Date().toISOString();
      const updatedate = createdate;
      const time = 0;
      verifyToken(req, reply, done)
      fastify.pg.query(
        `INSERT INTO project(id, projectName, user_id, createdate, updatedate, time)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [id, projectName, user_id, createdate, updatedate, time],
        function onResult(err, result) {
          if (err) reply.send(err)
          reply.code(201)
          reply.send(result?.rows[0])
        }
      )
    }
  })

  fastify.route({
    method: "DELETE",
    url: '/api/projects/:id',
    preHandler: fastify.auth([verifyToken]),
    schema: deleteProject,
    handler: async (req, reply) => {
      const id = req.params.id
      fastify.pg.query(
        'DELETE FROM project WHERE id = $1 RETURNING *', [id],
        function onResult(err, result) {
          if (err) reply.send(err)
          if (result?.rowCount !== 0) reply.send({deleted: true})
          else reply.send("Project not found!")
        }
      )
    }
  })

  fastify.route({
    method: "PUT",
    url: '/api/projects/:id',
    preHandler: fastify.auth([verifyToken]),
    schema: updateProject,
    handler: async (req, reply) => {
      const {projectName,} = req.body
      const id = req.params.id
      const updatedate = new Date().toISOString();

      fastify.pg.query(
        'UPDATE project SET projectName=$1, updatedate=$2 WHERE id=$3', [projectName, updatedate, id],
        function onResult(err, result) {
          if (err) reply.send(err)
          reply.code(201);
          reply.send({updated: true});
        }
      )
    }
  })
};

module.exports = projectRoutes;
