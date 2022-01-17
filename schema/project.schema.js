const typeString = {type: 'string'};

const getProjects = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: typeString,
          projectname: typeString,
          createdate: typeString,
          updatedate: typeString,
          time: typeString,
          user_id: typeString,
        },
      },
    },
  },
};

const createProject = {
  body: {
    type: 'object',
    required: ['projectName'],
    properties: {
      projectName: typeString,
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: typeString,
        projectname: typeString,
        createdate: typeString,
        updatedate: typeString,
        time: typeString,
        user_id: typeString,
      },
    },
  },
};

const deleteProject = {
  params: {
    type: 'object',
    properties: {
      id: {type: 'string', format: 'uuid'}
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        deleted: {type: 'boolean'}
      }
    }
  }
};

const updateProject = {
  params: {
    type: 'object',
    properties: {
      id: {type: 'string', format: 'uuid'}
    }
  },
  body: {
    type: 'object',
    properties: {
      projectname: typeString,
      createdate: typeString,
      updatedate: typeString,
      time: typeString,
      user_id: typeString,
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        updated: {type: 'boolean'}
      }
    }
  },
};

module.exports = {getProjects, createProject, deleteProject, updateProject}
