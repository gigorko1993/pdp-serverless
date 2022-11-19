const _ = require('lodash');

const {
  saveTask,
  findTaskById,
  getExpiringTasksIn24Hrs,
  getPendingTasksForUser,
  deleteTask,
} = require('./taskManager');
const { createResponse } = require('./responseHandler');

const saveATask = (text, userId, userName, callback) => {
  const [taskTitle, dueDate, taskDescription] = text.split(',');

  console.log('taskTitle: ', taskTitle, 'dueDate: ', dueDate, 'taskDescription: ', taskDescription, `userId: ${userId} userName: ${userName}`);
  
  saveTask(taskTitle.trim(), taskDescription.trim(), dueDate, userId, userName)
    .then(res => {
      console.log('response: ', res);
      callback(null, createResponse(200, res));
    })
    .catch(err => {
      console.log(err);
      callback(null, createResponse(500, 'Error on saving task'));
    });
};

const getATask = (text, callback) => {
  console.log('text in request body:', text);

  findTaskById(text)
    .then(result => {
      console.log('result: ', { attachments: result });
      callback(null, createResponse(200, { attachments: result }));
    })
    .catch(error => {
      console.log(error);
      callback(null, createResponse(500, 'Error getting a task'));
    });
};

const getAllPendingTasks = callback => {
  getExpiringTasksIn24Hrs()
    .then(result => {
      console.log(result);
      callback(null, createResponse(200, { attachments: result }));
    })
    .catch(error => {
      console.log(error);
      callback(null, createResponse(500, 'Error getting all pending tasks'));
    });
};

const getAllPendingTasksForUser = (userId, callback) => {
  getPendingTasksForUser(userId)
    .then(result => {
      console.log(result);
      callback(null, createResponse(200, { attachments: result }));
    })
    .catch(error => {
      console.log(error);
      callback(null, createResponse(500, 'Error getting all pending tasks for user'));
    });
}

const completeATask = (text, callback) => {
  const taskId = text;
    deleteTask(taskId)
    .then(result => {
      console.log(result);
      callback(null, createResponse(200, { text: `Task ${taskId} was completed` }));
    })
    .catch(error => {
      console.log(error);
      callback(null, createResponse(500, 'Error getting all pending tasks for user'));
    });
}

module.exports = {
    saveATask,
    getATask,
    getAllPendingTasks,
    getAllPendingTasksForUser,
    completeATask,
};
