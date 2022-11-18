'use strict';

const queryString = require('query-string');
const _ = require('lodash');

const {
  saveTask,
  findTaskById,
  getExpiringTasksIn24Hrs,
} = require('./taskManager');
const { slackPublish } = require('./slackPublisher');

const createResponse = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify(message),
});

module.exports.slackPublisher = (event, context, callback) => {
  console.log('slack publisher was called');
  slackPublish();
  callback(null, null);
};

module.exports.hello = (event, context, callback) => {
  callback(
    null,
    createResponse(200, {
      message: 'Test lambda',
      input: event,
    }),
  );

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.post = (event, context, callback) => {
  if (event.httpMethod === 'POST') {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        body: event.body,
      }),
    };
    callback(null, response);
  } else {
    callback(null, createResponse(200, 'Something else'));
  }
};

module.exports.createTask = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Task endpoint was called yeah',
      input: event,
    }),
  };
  callback(null, response);
};

const saveATask = (text, userId, userName, callback) => {
  const textArray = text.split(',');
  const taskTitle = textArray[0];
  const dueDate = textArray[1];

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
      console.log('result: ', result);
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

module.exports.tasks = (event, context, callback) => {
  const {
    command,
    text,
    user_id: userId,
    user_name: userName,
  } = queryString.parse(decodeURIComponent(event.body));

  console.log('command: ', command);
  if (command === '/new-task') {
    saveATask(text, userId, userName, callback);
  } else if (command === '/find-task') {
    getATask(text, callback);
  } else if (command === '/pending-tasks') {
    getAllPendingTasks(callback);
  } else {
    callback(
      null,
      createResponse(204, 'Another slack slash command was called'),
    );
  }
};
