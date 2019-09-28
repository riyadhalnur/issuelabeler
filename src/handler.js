'use strict';

const { serverless } = require('@probot/serverless-lambda');
const app = require('./app');

module.exports.bot = serverless(robot => {
  return robot.on(['issues.opened', 'issues.edited'], app)
});
