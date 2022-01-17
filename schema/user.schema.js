const typeString = {type: 'string'};

const getAdmins = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: typeString,
            email: typeString,
          },
        },
      },
    },
  },
};

const registerAdmin = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        password: typeString,
        email: typeString,
        name: typeString,
      },
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: typeString,
          password: typeString,
          email: typeString,
          name: typeString,
          token: typeString,
        },
      },
    },
  },
};

const loginAdmin = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        password: typeString,
        email: typeString,
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          token: typeString,
        },
      },
    },
  }
};

const getMe = {
  response: {
    200: {
      type: 'object',
      properties: {
        id: typeString,
        email: typeString,
        name: typeString,
      },
    },
  },
};

module.exports = {loginAdmin, getAdmins, registerAdmin, getMe}
