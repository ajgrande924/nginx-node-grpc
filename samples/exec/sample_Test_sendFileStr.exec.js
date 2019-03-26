/* eslint-disable */

let fileData = fs.createWriteStream(path.resolve(process.cwd(), './sample_out.tar.gz'));

client.sendFileStr({req: 'ping'})
  .on('data', streamReply('file:data', fileData, (payload) => payload.chunk))
  .on('status', streamReply('file:status'))
  .on('end', streamReply('file:end', fileData))