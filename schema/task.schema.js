const typeString = {type: 'string'};

const getTask = {
  params: {
    type: 'object',
    properties: {
      id: {type: 'string', format: 'uuid'}
    }
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: typeString,
          task_name: typeString,
          create_date: typeString,
          update_date: typeString,
          time: typeString,
          project_id: typeString,
          user_id: typeString,
        },
      },
    },
  },
};

const createTask = {
  body: {
    type: 'object',
    required: ['task_name', 'project_id'],
    properties: {
      task_name: typeString,
      project_id: typeString,
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: typeString,
        task_name: typeString,
        create_date: typeString,
        update_date: typeString,
        time: typeString,
        project_id: typeString,
        user_id: typeString,
      },
    },
  },
};

const deleteTask = {
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

const updateTask = {
  params: {
    type: 'object',
    properties: {
      id: {type: 'string', format: 'uuid'}
    }
  },
  body: {
    type: 'object',
    properties: {
      task_name: typeString,
      create_date: typeString,
      update_date: typeString,
      time: typeString,
      project_id: typeString,
      user_id: typeString,
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        updated: {type: 'boolean'},
        task: {
          id: typeString,
          task_name: typeString,
          create_date: typeString,
          update_date: typeString,
          time: typeString,
          project_id: typeString,
          user_id: typeString,
        }
      }
    }
  },
};

module.exports = {getTask, createTask, deleteTask, updateTask}
