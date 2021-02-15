'use strict';

module.exports.catch = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    return {
      statusCode: 200,
      body: 'PONG',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};
