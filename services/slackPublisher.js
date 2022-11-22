'use strict';

const axios = require('axios');

const { getExpiringTasksIn24Hrs, saveTaskAndPostToSlack } = require('./taskManager');
const { createResponse } = require('./responseHandler');
const { SLACK_URL, SLACK_URL_TASK_MANAGER } = require('../env')

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
  return getExpiringTasksIn24Hrs().then(result => sendMessageToSlack({ attachments: result }, SLACK_URL));
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
