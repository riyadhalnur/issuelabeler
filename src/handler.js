"use strict";

const {
  createLambdaFunction,
  createProbot,
} = require("@probot/adapter-aws-lambda-serverless");
const app = require("./app");

module.exports = {
  bot: createLambdaFunction(app, { probot: createProbot() }),
};
