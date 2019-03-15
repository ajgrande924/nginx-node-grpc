/* eslint-disable */
client.sendFileStr({req: 'ping'})
  .on('data', streamReplyData)
  .on('end', streamReplyEnd)