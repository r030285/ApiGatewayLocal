# ApiGatewayLocal
AWS ApiGateway Simulator for local tests using RAML to configure

run.raml model:

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

After git clone is possible execute this way:
```bash
node ./lin/ApiGatewayLocal.js
```
- Port default: 2020
- File path default: ./run.raml

```bash
node ./lin/ApiGatewayLocal.js --file=./test/run.raml --port=3030
```

If you install global with:
```bash
npm -g install apigatewaylocal
```
```bash
apigatewaylocal --file=./test/run.raml --port=3030
```

if necessary create a symbolic link.
```bash
sudo ln -s ~/.npm-global/bin/apigatewaylocal /usr/local/bin/apigatewaylocal
```
