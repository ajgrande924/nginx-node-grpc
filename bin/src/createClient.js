'use strict';

const path = require('path');
const grpc = require('grpc');
const fs = require('fs');
const protoLoader = require('@grpc/proto-loader');
const vm = require('vm');

const Logger = require('../../src/logger');
const logger = new Logger({ level: 'info' });

const { printReply, streamReplyData, streamReplyEnd } = require('./execFunc');

function createCredentials(options) { // grpc,fs,logger
  if (options.insecure) return grpc.credentials.createInsecure();
  if (!options.rootCert) return grpc.credentials.createSsl();

  let rootCert = undefined;
  let privateKey = undefined;
  let certChain = undefined;

  try {
    if (options.rootCert) rootCert = fs.readFileSync(options.rootCert);
    if (options.privateKey) privateKey = fs.readFileSync(options.privateKey);
    if (options.certChain) certChain = fs.readFileSync(options.certChain);
  } catch(e) {
    logger.log('error', `Unable to load custom SSL certs: ${e}`);
    process.exit(1);
  }

  return grpc.credentials.createSsl(rootCert, privateKey, certChain);
}

function createClient(args, options) {
  const { proto, service, address, exec } = args;

  logger.log('info', `proto: ${proto}`);
  logger.log('info', `service: ${service}`);
  logger.log('info', `address: ${address}`);
  logger.log('info', `exec: ${exec}`);

  const PROTO_PATH = path.isAbsolute(proto) ? proto : path.resolve(process.cwd(), proto);
  const EXEC_PATH  = path.isAbsolute(exec) ? exec : path.resolve(process.cwd(), exec);
  const EXEC_STR   = fs.readFileSync(EXEC_PATH, 'utf8');

  const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
  
  // use this to view package:service(s):method(s)
  // console.log('packageDefinition', packageDefinition);
  
  const pkg = Object.keys(grpc.loadPackageDefinition(packageDefinition))[0];
  const PROTO_INFO = grpc.loadPackageDefinition(packageDefinition)[pkg];
  // console.log('PROTO_INFO', PROTO_INFO);

  // TODO: check if service exists in proto
  // TODO: check if address is valid

  const creds = createCredentials(options);

  const client = new PROTO_INFO[service](address, creds);

  let fileData = fs.createWriteStream('sample.tar.gz');

  const sandbox = { 
    grpc, 
    client, 
    printReply: printReply.bind(null, logger),
    streamReplyData: streamReplyData.bind(null, fileData),
    streamReplyEnd: streamReplyEnd.bind(null, fileData)
  };

  const script = new vm.Script(EXEC_STR);
  const context = vm.createContext(sandbox);
  script.runInContext(context);

  // DEBUG: view sandbox
  // const util = require('util');
  // console.log('sandbox', util.inspect(sandbox));

}

module.exports = createClient;