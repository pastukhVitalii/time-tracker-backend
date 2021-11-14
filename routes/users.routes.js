const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const verifyToken = require("../auth/verifyToken");
const {getAdminsOpts, loginAdminOpts, registerAdminOpts, getMe} = require('../schema/user.schema.js');

const adminRoutes = (fastify, options, done) => {
  fastify.register(require('fastify-auth')).after(() => privateRoutes(fastify, options, done));

  // get all admins
  fastify.get('/api/admins', getAdminsOpts, async (req, reply) => {

    fastify.pg.query(
      'SELECT * FROM admin',
      function onResult(err, result) {
        reply.send(err || result.rows)
      }
    )
  })

  // login an admin
  fastify.post('/api/admins/login', loginAdminOpts, async (req, reply) => {

    const {password} = req.body;
    const {email} = req.body;

    const getAdmin = async () => {
      const client = await fastify.pg.connect()
      const res = await client.query(
        `SELECT *
         FROM admin
         WHERE email = COALESCE($1, email) `, [email],
      )
      // client.release()
      return res.rows[0];
    }
    try {
      const admin = await getAdmin();
      if (!admin) {
        return reply.send("This admin doesn't exist");
      }

      // check if password is correct
      if (password !== admin.password) {
        return reply.send('Invalid credentials');
      }

      // sign a token
      jwt.sign(
        {id: admin},
        'my_jwt_secret',
        {expiresIn: 3 * 86400},
        (err, token) => {
          if (err) throw err;
          reply.send({token: token});
        }
      );

      await reply;
    } catch (err) {
      console.log(err);
      reply.status(500).send('Server error');
    }
  })

  // register an admin
  fastify.post('/api/admins/new', registerAdminOpts, async (req, reply) => {
    const {email} = req.body;
    const {password} = req.body;
    const id = uuidv4();

    const getAdmin = async () => {
      const client = await fastify.pg.connect()
      const res = await client.query(
        `SELECT *
         FROM admin
         WHERE email = COALESCE($1, email) `, [email],
      )
      // client.release()
      return res.rows[0];
    }
    const admin = await getAdmin();
    if (admin) {
      return reply.send("This email is using");
    }
    fastify.pg.query(
      `INSERT INTO admin(id, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`, [id, email, password],
      function onResult(err, result) {
        reply.send(err || result.rows[0])
      }
    )
  })

  done();
};

const privateRoutes = (fastify, options, done) => {
  fastify.route({
    method: "GET",
    url: '/api/admins/me',
    preHandler: fastify.auth([verifyToken]),
    schema: getMe,
    handler: async (req, reply) => {
      const id = req.user.id.id;
      fastify.pg.query(
        'SELECT * FROM admin WHERE id = $1', [id],
        function onResult(err, result) {
          console.log("-> ", err);
          console.log("-> result", result);
          if (err) reply.send({status: false})
          else reply.send(result.rows[0])
        }
      )
    }
  })
}
module.exports = adminRoutes;
