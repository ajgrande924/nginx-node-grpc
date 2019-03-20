/* eslint-disable */

let fileData = fs.createWriteStream(path.resolve(process.cwd(), './sample_out.tar.gz'));

client.sendFileStr({req: 'ping'})
  .on('data', streamReply(fileData, 'file:data', (payload) => payload.chunk))
  .on('end', streamReply(fileData, 'file:end'))