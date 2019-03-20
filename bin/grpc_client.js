'use strict';

const program = require('commander');
const pkg = require('../package.json');
const client = require('./src/createClient');

program
  .version(pkg.version)
  .option('-p, --proto <path>', 'path to a protobuf file describing the service (required)')
  .option('-a, --address <host:port>', 'the address of the service to connect to (required)')
  .option('-s, --service <name>', 'the name of the service to connect to (required)')
  .option('-x, --exec <path>', 'execute a script file and print the results (required)')
  .option('-i, --insecure', 'use an insecure connection (default: false)', false)
  // .option('-e, --eval <string>', 'evaluate script and print result (optional)')
  .option('-l, --log_level <level>', 'logger level [error|warn|info|verbose|debug|silly]', 'info')
  .option('--root_cert <path>', 'specify root certificate path for secure connections (optional)')
  .option('--private_key <path>', 'specify private key path for secure connections (optional)')
  .option('--cert_chain <path>', 'specify certificate chain path for secure connections (optional)')
  .parse(process.argv);

try {
  client(program, {
    insecure: program.insecure,
    rootCert: program.root_cert,
    privateKey: program.private_key,
    certChain: program.cert_chain
  });
} catch (e) {
  throw e;
}