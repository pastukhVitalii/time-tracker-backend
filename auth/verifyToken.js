const jwt = require('jsonwebtoken');

function verifyToken(req, reply, done) {
  if (!req.headers.authorization) {
    done(new Error("Token is missed"))
  }
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, 'my_jwt_secret', (err, decoded) => {
    if (err) {
      done(new Error('Unauthorized'));
    }
    req.user = {
      id: decoded.id, // pass in the user's info
    };
  });

  done();
}

module.exports = verifyToken
