'use strict';

const { format } = require('date-fns');

const formatter = (task, i = null) => ({
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Task ${i === null ? "." : i + 1}`,
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

const formatAttachment = tasksList => {
  console.log('task List inside formatAttachment: ', tasksList);
  const attachments = tasksList.map((task, i) => {
    return formatter(task, i);
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
formatAttachmentSingleTask
}