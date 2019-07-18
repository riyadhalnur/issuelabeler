'use strict';

const { serverless } = require('@probot/serverless-lambda');
const appFn = require('./app');

module.exports.bot = serverless(appFn);
