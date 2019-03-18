# nginx-node-grpc
> nginx proxy & grpc node server example w/ ssl

### setup

```sh
# install dependencies
npm install

# generate certificates using openssl
npm run gen:certs

# bring up nginx proxy on port 80 (grpc) & 1443 (grpcs)
# bring up grpc server on port 50051 (grpc) & 443 (grpcs)
docker-compose up -d # dkcu
```

### usage

```sh
# node bin/grpc_client.js -h
Usage: grpc_client [options]

Options:
  -V, --version              output the version number
  -p, --proto <path>         path to a protobuf file describing the service (required)
  -a, --address <host:port>  the address of the service to connect to (required)
  -s, --service <name>       the name of the service to connect to (required)
  -x, --exec <path>          execute a script file and print the results (required)
  -i, --insecure             use an insecure connection (default=false)
  --root_cert <path>         specify root certificate path for secure connections (optional)
  --private_key <path>       specify private key path for secure connections (optional)
  --cert_chain <path>        specify certificate chain path for secure connections (optional)
  -h, --help                 output usage information
```

### examples

```sh
# grpc proxy: /sample.Test/sendReq
node ./bin/grpc_client.js -i \
  -p ./src/proto/sample.proto \
  -a localhost:80 \
  -s Test \
  -x ./bin/exec/sample_Test_sendReq.exec.js

# grpc proxy: /sample.Test/sendFileStr
node ./bin/grpc_client.js -i \
  -p ./src/proto/sample.proto \
  -a localhost:80 \
  -s Test \
  -x ./bin/exec/sample_Test_sendFileStr.exec.js

# grpc server ssl (mutual tls): /sample.Test/sendReq
node ./bin/grpc_client.js \
  --root_cert ./certs/ca.crt \
  --private_key ./certs/client.key \
  --cert_chain ./certs/client.crt \
  -p ./src/proto/sample.proto \
  -a localhost:443 \
  -s Test \
  -x ./bin/exec/sample_Test_sendReq.exec.js

# grpc proxy ssl (mutual tls): /sample.Test/sendReq
node ./bin/grpc_client.js \
  --root_cert ./certs/ca.crt \
  --private_key ./certs/client.key \
  --cert_chain ./certs/client.crt \
  -p ./src/proto/sample.proto \
  -a localhost:1443 \
  -s Test \
  -x ./bin/exec/sample_Test_sendReq.exec.js

# grpc proxy ssl (normal tls): /sample.Test/sendReq
node ./bin/grpc_client.js \
  --root_cert ./certs/ca.crt \
  -p ./src/proto/sample.proto \
  -a localhost:1443 \
  -s Test \
  -x ./bin/exec/sample_Test_sendReq.exec.js
```