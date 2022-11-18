'use strict';

const queryString = require('query-string');

const { slackPublish } = require('./services/slackPublisher');
const { saveATask, getATask, getAllPendingTasks } = require('./services/tasks');
const { createResponse } = require('./services/responseHandler');


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
