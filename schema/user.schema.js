const typeString = {type: 'string'};

const getAdminsOpts = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: typeString,
            password: typeString,
            email: typeString,
          },
        },
      },
    },
  },
};

const registerAdminOpts = {
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
          id: typeString,
          password: typeString,
          email: typeString,
        },
      },
    },
  },
};

const loginAdminOpts = {
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

module.exports = {loginAdminOpts, getAdminsOpts, registerAdminOpts}