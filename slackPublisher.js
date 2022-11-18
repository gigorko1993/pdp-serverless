'use strict';

const { axios } = require('axios');

const { getExpiringTasksIn24Hrs } = require('./taskManager');

const SLACK_URL =
  'https://hooks.slack.com/services/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';

const sendMessageToSlack = text => {
  const response = axios.get(SLACK_URL, { ...text }).promise();
  console.log(response);
};

module.exports.slackPublish = () => {
  getExpiringTasksIn24Hrs().then(result => {
    return sendMessageToSlack({ attachments: result });
  });
};
