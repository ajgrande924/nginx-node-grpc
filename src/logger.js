'use strict';

const { createLogger, format, transports } = require('winston');

function Logger({ level }) {
  return createLogger({
    format: format.simple(),
    transports: [
      new transports.Console({ level })
    ]
  });
}

module.exports = Logger;