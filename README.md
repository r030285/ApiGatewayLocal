# ApiGatewayLocal
AWS ApiGateway Simulator for local tests using RAML to configure


```yaml
#%RAML 1.0
title: Test report data
mediaType: application/json

traits:
    ../mailcore-node/Server#mailserverHandler:
    ../mailsender-node/Server#mailserverHandler:

/mailcore:
    post:
        is: [../mailcore-node/Server#mailserverHandler]
/mailsender:
    post:
        is: [../mailsender-node/Server#mailserverHandler]
```
```bash
node ApiGatewayLocal.js
```
- Port default: 2020
- File path default: run.raml

```bash
node ApiGatewayLocal.js --file=./test/run.raml --port=3030
```
