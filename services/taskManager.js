'use strict';
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const { parse, getTime, addSeconds } = require('date-fns');

const dynamo = new AWS.DynamoDB.DocumentClient();

const {
  formatAttachment,
  formatAttachmentSingleTask,
} = require('./tasksFormatter');

module.exports.saveTask = (
  taskTitle,
  taskDescription,
  dueDate,
  userId,
  username,
) => {
  const date = getTime(
    new Date(parse(dueDate, 'yyyy-MM-dd HH:mm', new Date())),
  );

  const task = {
    taskId: uuidv4(),
    taskTitle,
    taskDescription,
    dueDate: date,
    userId,
    username,
  };

  const params = {
    TableName: process.env.TASK_DYNAMODB_TABLE,
    Item: task,
  };

  return dynamo
    .put(params)
    .promise()
    .then(() => task.taskId);
};

module.exports.deleteTask = taskId => {
  const params = {
    TableName: process.env.TASK_DYNAMODB_TABLE,
    Key: {
      taskId: taskId,
    },
  };

  return dynamo.delete(params).promise();
};

module.exports.findTaskById = taskId => {
  const params = {
    TableName: process.env.TASK_DYNAMODB_TABLE,
    Key: {
      taskId: taskId,
    },
  };

  return dynamo
    .get(params)
    .promise()
    .then(({ Item }) => {
      return formatAttachmentSingleTask(Item);
    });
};

module.exports.getExpiringTasksIn24Hrs = () => {
  const today = Number(getTime(new Date()));
  const tomorrow = Number(getTime(new Date(addSeconds(new Date(), 86400)))); //24 hrs from now 24*60*60

  console.log('today', today);
  console.log('tomorrow', tomorrow);

  const params = {
    ExpressionAttributeNames: {
      '#dd': 'dueDate',
    },
    ExpressionAttributeValues: {
      ':tomorrow': tomorrow,
      ':today': today,
    },
    FilterExpression: '#dd between :today and :tomorrow',
    TableName: process.env.TASK_DYNAMODB_TABLE,
  };

  return dynamo
    .scan(params)
    .promise()
    .then(({ Items }) => {
      return formatAttachment(Items);
    });
};
