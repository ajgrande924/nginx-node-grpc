# nginx-node-grpc

### usage

```sh
npm install
npm run gen:certs
```

```sh
# example: /sample.Test/sendReq
node ./bin/grpc_client.js -i \
  -p ./src/proto/sample.proto \
  -a 0.0.0.0:50051 \
  -s Test \
  -x ./bin/exec/sample_Test_sendReq.exec.js

# example: /sample.Test/sendFileStr
node ./bin/grpc_client.js -i \
  -p ./src/proto/sample.proto \
  -a 0.0.0.0:50051 \
  -s Test \
  -x ./bin/exec/sample_Test_sendFileStr.exec.js

# server ssl example: /sample.Test/sendReq
node ./bin/grpc_client.js \
  --root_cert ./certs/ca.crt \
  --private_key ./certs/client.key \
  --cert_chain ./certs/client.crt \
  -p ./src/proto/sample.proto \
  -a localhost:443 \
  -s Test \
  -x ./bin/exec/sample_Test_sendReq.exec.js

# proxy ssl example: /sample.Test/sendReq
node ./bin/grpc_client.js \
  --root_cert ./certs/ca.crt \
  --private_key ./certs/client.key \
  --cert_chain ./certs/client.crt \
  -p ./src/proto/sample.proto \
  -a localhost:1443 \
  -s Test \
  -x ./bin/exec/sample_Test_sendReq.exec.js
```