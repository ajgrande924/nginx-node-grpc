'use strict';

function printReply(logger, err, reply) {
  if (err) {
    if (err.metadata) err.metadata = err.metadata.getMap();
    logger.log('error', err);
  } else {
    logger.log('info', JSON.stringify(reply, null, 2));
  }
}

function streamReply(fileData, evt, cb) {
  return function(payload) {
    if (evt === 'file:data') {
      const chunk = cb(payload);
      fileData.write(chunk);
    } else if (evt === 'file:end') {
      fileData.end();
    } else {
      // not implemented
    }
  };
}

module.exports = {
  printReply,
  streamReply
};