'use strict';

const queryString = require('query-string');

const { slackPublish, slackPublishNewTask } = require('./services/slackPublisher');
const { saveATask, getATask, getAllPendingTasks, getAllPendingTasksForUser, completeATask } = require('./services/tasks');
const { createResponse } = require('./services/responseHandler');


module.exports.slackPublisher = (event, context, callback) => {
  console.log('slack publisher was called');
  slackPublish();
  callback(null, null);
};

module.exports.slackTask = (event, context, callback) => {
  console.log("event.body: ", event.body);
  const {text} = JSON.parse(event.body);

  if (event.httpMethod === "POST") {
    slackPublishNewTask(text, callback);

  } else {
    callback(
      null,
      createResponse(404, 'Error on task creation'),
    );
  }
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

  } else if (command === '/task-pending-user') {
    getAllPendingTasksForUser(userId, callback);

  } else if (command === '/task-complete') {
    completeATask(text, callback);
    
  } else {
    callback(
      null,
      createResponse(204, 'Another slack slash command was called'),
    );
  }
};
