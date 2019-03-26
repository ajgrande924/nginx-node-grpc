'use strict';

function printReply(logger, err, reply) {
  if (err) {
    if (err.metadata) err.metadata = err.metadata.getMap();
    logger.log('error', err);
  } else {
    logger.log('info', JSON.stringify(reply, null, 2));
  }
}

function streamReply(logger, evt, fileData, cb) {
  return function(payload) {
    if (evt === 'file:data') {
      const chunk = cb(payload);
      fileData.write(chunk);
    } else if (evt === 'file:end') {
      fileData.end();
    } else if (evt === 'file:status') {
      logger.log('debug', JSON.stringify(payload));
    } else {
      logger.log('info', JSON.stringify(payload));
    }
  };
}

module.exports = {
  printReply,
  streamReply
};