'use strict';
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const { parse, getTime } = require("date-fns");



module.exports.saveTask = (taskTitle, taskDescription, dueDate, userId, username) => {
  const date = getTime(new Date(parse(dueDate, "yyyy-MM-dd HH:mm", new Date())));

  const task = { taskId: uuidv4(), taskTitle, taskDescription, dueDate: date, userId, username };

  const params = {
  TableName : process.env.TASK_DYNAMODB_TABLE,
  Item: task
  };

  return dynamo.put(params).promise().then(() => task.taskId);
};

module.exports.deleteTask = (taskId) => {
  const params = {
    TableName: process.env.TASK_DYNAMODB_TABLE,
    Key: {
      taskId: taskId
    }
  };

  return dynamo.delete(params).promise();
};

module.exports.findTaskById = (taskId) => {
  const params = {
    TableName: process.env.TASK_DYNAMODB_TABLE,
    Key: {
      taskId: taskId
    }
  };

  return dynamo.get(params).promise();
};