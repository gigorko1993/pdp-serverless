'use strict';

const queryString = require("query-string");
const _ = require("lodash");

const taskManager = require("./taskManager");

const createResponse = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify(message)
})


module.exports.hello = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Test lambda',
        input: event,
      },
    ),
  };
  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.post = async (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        body: event.body
      })
    }
    callback(null, response);
  } else {
    callback(null, createResponse(200, "Something else"));
  };
};

module.exports.createTask = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Task endpoint was called yeah",
      input: event,
    })
  }
  callback(null, response);
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


const saveATask = (text, userId, userName, callback) => {
  const textArray = text.split(",");
  const taskTitle = textArray[0];
  const dueDate = textArray[1];

  const taskDescription = _.tail(_.tail(textArray)).join();

  console.log("taskTitle: ", taskTitle);
  console.log("dueDate: ", dueDate);
  console.log("taskDescription: ", taskDescription);
  console.log("id name: ", userId + " " + userName);

  taskManager.saveTask(taskTitle, taskDescription, dueDate, userId, userName).then(res => {
    console.log(res);
    callback(null, createResponse(200, "Save a task"));
  }).catch(err => {
    console.log(err);
    callback(null, createResponse(500, "Error on saving task"))
  })
}

module.exports.tasks = async (event, context, callback) => {
  const { command, text, user_id: userId, user_name: userName } = queryString.parse(decodeURIComponent(event.body));
  
  if (command === "/new-task") {
    saveATask(text, userId, userName, callback);
  } else {
    callback(null, createResponse(200, "Another method was called"))
  }
};
