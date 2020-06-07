'use strict';

const { serverless } = require('@probot/serverless-lambda');
const app = require('./app');

const eventTypes = ['issues.opened', 'issues.edited'];

module.exports = {
  events: eventTypes,
  bot: serverless(robot => robot.on(eventTypes, app))
};
