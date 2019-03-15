'use strict';

function printReply(logger, err, reply) {
  if (err) {
    if (err.metadata) err.metadata = err.metadata.getMap();
    logger.log('error', err);
  } else {
    logger.log('info', JSON.stringify(reply, null, 2));
  }
}

function streamReplyData(fileData, {chunk}) {
  fileData.write(chunk);
}

function streamReplyEnd(fileData) {
  fileData.end();
}

module.exports = {
  printReply,
  streamReplyData,
  streamReplyEnd
};