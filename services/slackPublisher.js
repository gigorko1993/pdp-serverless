'use strict';

const axios = require('axios');
const _ = require('lodash');

const { getExpiringTasksIn24Hrs, saveTaskAndPostToSlack } = require('./taskManager');
const { createResponse } = require('./responseHandler');

const SLACK_URL =
  'https://hooks.slack.com/services/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';

const SLACK_URL_TASK_MANAGER =
  'https://hooks.slack.com/services/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';
  

const sendMessageToSlack = ({taskId, taskTitle, dueDate, taskDescription}, url) => {
  console.log("Text in sendMessageToSlack: ", {taskId, taskTitle, dueDate, taskDescription});

  axios.post(url, { text: `ID: ${taskId},  Title: ${taskTitle}, Expire Date: ${dueDate}, Description: ${taskDescription}` })
  .then(() => {
    console.log("posted to slack");
  })
  .catch((error) => {
    console.log("posted to slack error", error);
  });
};

const slackPublish = () => {
  return getExpiringTasksIn24Hrs().then(result => {
    return sendMessageToSlack({ attachments: result }, SLACK_URL);
  });
};

const slackPublishNewTask = (text, callback) => {
  const [taskTitle, dueDate, taskDescription] = text.split(',');

  saveTaskAndPostToSlack(taskTitle.trim(), taskDescription.trim(), dueDate)
    .then(taskId => {

      sendMessageToSlack({ taskId, dueDate, taskTitle, taskDescription }, SLACK_URL_TASK_MANAGER);
      callback(null, createResponse(200, { body: {taskId} }));
    })
    .catch(error => {
      console.log(error);
      callback(null, createResponse(500, 'Error on saving task to DB'));
    });
};

module.exports = {
slackPublish,
slackPublishNewTask
}
