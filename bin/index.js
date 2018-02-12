#!/usr/bin/env node

var apigatewaylocal = require("../lib/ApiGatewayLocal.js");
var apigatewaylocalYml = require("../lib/ApiGatewayLocalYml.js");

if(process.argv.indexOf('--help')>-1){
    console.log("Usage: apigatewaylocal [--file run.yml][--port 2020]");
    console.log("Files extensions:");
    console.log(" .raml, .yml, .yaml");
    console.log("Options:");
    console.log(" --file    File configurations (default: run.raml)");
    console.log(" --port    Port start service (default: 2020)");
    return;
}

let index = null
for(let i=0;i<process.argv.length;i++){
    if(process.argv[i].indexOf("--file")>-1){
        index = i;
        break;
    }
    param="";
}

if(index && (process.argv[(1+index)].indexOf("yml")>-1 ||
             process.argv[(1+index)].indexOf("yaml")>-1)){
    apigatewaylocalYml.start(process.argv);
}else{
    apigatewaylocal.start(process.argv);
}
