'use strict';

const { format } = require('date-fns');

const formatter = (task) => ({
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Task`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Title:*\n${task?.taskTitle || 'no title'}`,
        },
        {
          type: 'mrkdwn',
          text: `*Text:*\n${task?.taskDescription || 'no description'}`,
        },
      ],
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Task ID:*\n${
            task?.taskId || 'wrong id, please message to support'
          }`,
        },
        {
          type: 'mrkdwn',
          text: `*Due Date:*\n${
            task?.dueDate && format(new Date(task?.dueDate), 'yyyy-MM-dd HH:mm')
          }`,
        },
      ],
    },
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: `*Author:*\n${task?.username && '-'}`,
          emoji: true,
        },
      ],
    },
  ],
});

const emptyTaskList = () => ({
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `No pending tasks for today and tomorrow`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: "run new-task slash command to create new task"
        },
      ],
    },
  ],
});

const formatAttachment = tasksList => {
  console.log('task List inside formatAttachment: ', tasksList);
  const attachments = tasksList.map((task) => {
    return formatter(task);
  });

  console.log('attachments: ', attachments);
  return attachments;
};

const formatAttachmentSingleTask = task => {
  console.log('task inside formatAttachment: ', task);
  const attachments = [formatter(task)];

  console.log('attachments: ', attachments);
  return attachments;
};

module.exports = {
formatAttachment,
formatAttachmentSingleTask,
emptyTaskList
}