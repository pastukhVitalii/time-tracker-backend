const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const verifyToken = require("../auth/verifyToken");
const {getAdmins, loginAdmin, registerAdmin, getMe} = require('../schema/user.schema.js');

const adminRoutes = (fastify, options, done) => {
  fastify.register(require('fastify-auth')).after(() => privateRoutes(fastify, options, done));

  // get all admins
  fastify.get('/api/admins', getAdmins, async (req, reply) => {

    fastify.pg.query(
      'SELECT * FROM admin',
      function onResult(err, result) {
        reply.send(err || result.rows)
      }
    )
  })

  // login an admin
  fastify.post('/api/admins/login', loginAdmin, async (req, reply) => {

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
        return reply.send('Invalid password');
      }

      // sign a token
      jwt.sign(
        {user: admin},
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
  fastify.post('/api/admins/new', registerAdmin, async (req, reply) => {
    const {email, name} = req.body;
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
      `INSERT INTO admin(id, email, name, password)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [id, email, name, password],
      function onResult(err, result) {
        if (err) reply.send(err)
        // sign a token
        const t = jwt.sign(
          {
            user: {
              id: id,
              email: email,
              password: password,
              name: name
            }
          },
          'my_jwt_secret',
          {expiresIn: 3 * 86400});
        reply.send({...result.rows[0], token: t})
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
      const id = req.user.user.id;
      fastify.pg.query(
        'SELECT * FROM admin WHERE id = $1', [id],
        function onResult(err, result) {
          if (err) reply.send({status: false})
          else reply.send(result.rows[0])
        }
      )
    }
  })
}
module.exports = adminRoutes;
