const _ = require('lodash');

const {
  saveTask,
  findTaskById,
  getExpiringTasksIn24Hrs,
} = require('./taskManager');
const { createResponse } = require('./responseHandler');

const saveATask = (text, userId, userName, callback) => {
  const [taskTitle, dueDate] = text.split(',');
//   const taskTitle = textArray[0];
//   const dueDate = textArray[1];

  const taskDescription = _.tail(_.tail(textArray)).join();

  console.log('taskTitle: ', taskTitle);
  console.log('dueDate: ', dueDate);
  console.log('taskDescription: ', taskDescription);
  console.log(`userId: ${userId} userName: ${userName}`);

  saveTask(taskTitle, taskDescription, dueDate, userId, userName)
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
      callback(null, createResponse(200, result));
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

module.exports = {
    saveATask,
    getATask,
    getAllPendingTasks
};
