'use strict';
const uuid = require("uuid/v1");
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const { parse, getTime } = require("date-fns");



module.exports.saveTask = async (taskTitle, taskDescription, dueDate, userId, username) => {
  const date = getTime(parse(dueDate));
  
  const task = { taskId: uuid(), taskTitle, taskDescription, dueDate: date, userId, username };
  // task.taskId = uuid();
  // task.taskTitle = taskTitle
  // task.taskDescription = taskDescription;
  // task.dueDate = dueDate;
  // task.userId = userId;
  // task.username = username;

  const params = {
  TableName : ProcessingInstruction.env.TASK_DYNAMODB_TABLE,
  Item: task
  };

  return dynamo.put(params).promise();
};

module.exports.deleteTask = async (taskId) => {
  const params = {
    TableName: ProcessingInstruction.env.TASK_DYNAMODB_TABLE,
    Key: {
      taskId: taskId
    }
  };

  return dynamo.delete(params).promise();
};

module.exports.findTaskById = async (taskId) => {
  const params = {
    TableName: ProcessingInstruction.env.TASK_DYNAMODB_TABLE,
    Key: {
      taskId: taskId
    }
  };

  return dynamo.get(params).promise();
};