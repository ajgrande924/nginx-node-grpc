'use strict';

const path = require('path');
const grpc = require('grpc');
const fs = require('fs');
const protoLoader = require('@grpc/proto-loader');
const Logger = require('./logger');

const logger = new Logger({ level: 'info' });

const PROTO_PATH = path.resolve(__dirname, 'proto/sample.proto');

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const proto = grpc.loadPackageDefinition(packageDefinition).sample;

function sendReq(call, callback) { // logger
  logger.log('info', '/sample.Test/sendReq');
  callback(null, {res: call.request.req + ':pong'});
}

function sendFileStr(call) { // fs,path,logger
  logger.log('info', '/sample.Test/sendFileStr');
  fs.createReadStream(path.resolve(__dirname, 'assets/sample.tar.gz'))
    .on('data', function(chunk) {
      call.write({chunk});
    })
    .on('end', function() {
      call.end();
    });
}

function createServerCredentials(options = {}) { // grpc,fs,logger
  if (options.insecure) return grpc.ServerCredentials.createInsecure();

  let rootCert = undefined;
  let privateKey = undefined;
  let certChain = undefined;
  
  try {
    rootCert = fs.readFileSync(path.resolve(__dirname, '../certs/ca.crt'));
    privateKey = fs.readFileSync(path.resolve(__dirname, '../certs/server.key'));
    certChain = fs.readFileSync(path.resolve(__dirname, '../certs/server.crt'));
  } catch(e) {
    logger.log('error', `Unable to load custom SSL certs: ${e}`);
    process.exit(1);
  }
  
  return grpc.ServerCredentials.createSsl(rootCert, [{ cert_chain: certChain, private_key: privateKey }], true);
}

function main() {
  const server = new grpc.Server();
  const port = process.argv[2] === 'ssl' ? 443 : 50051;
  const creds = process.argv[2] === 'ssl' ? createServerCredentials() : createServerCredentials({ insecure: true });
  server.addService(proto.Test.service, {sendReq, sendFileStr});
  server.bind(`0.0.0.0:${port}`, creds);
  server.start();
  logger.log('info', `grpc server running @ 0.0.0.0:${port}`);
}

main();