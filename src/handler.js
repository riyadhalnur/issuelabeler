'use strict';

const { serverless } = require('@probot/serverless-lambda');
const app = require('./app');

module.exports.bot = serverless(robot => robot.on('issues.opened', app));
