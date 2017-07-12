# ApiGatewayLocal
AWS ApiGateway Simulator for local tests using RAML to configure


```yaml
#%RAML 1.0
title: Test report data
mediaType: application/json

traits:
    ./test/LambdaTest#main:

/test:
    get:
        is: [./test/LambdaTest#main]
```
```bash
node ApiGatewayLocal.js
```
- Port default: 2020
- File path default: run.raml

```bash
node ApiGatewayLocal.js --file=./test/run.raml --port=3030
```
