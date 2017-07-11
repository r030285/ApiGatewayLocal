const Express = require("express");
const BodyParser = require("body-parser");
const RamlParser = require('raml-1-parser');

const app = new Express();

app.use(BodyParser.json());

var api = RamlParser.loadApi("run.raml");

app.options((request, response)=>{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "*");
    response.status(200).send();
})


const traits = [];
const methods = [];
api.then((d)=>{
    d.traits().forEach((trait)=>{
        var f = function(req, res){

            var context = {"res":res, "done": function(data){
                console.log("ENDEND", data);
                res.status(200).send(data);
            }}
            var t = trait.name().split("#");
            const reqFile = require(t[0]+".js");
            reqFile[t[1]](req['body'], context);
        }
        traits[trait.name()] = f;
    });
    console.log(traits);

    d.resources().forEach((resource)=>{
        console.log(resource.displayName());
        resource.methods().forEach((method)=>{
            console.log(method.method());
            console.log(method.is()[0].name());
            var func = traits[method.is()[0].name()];
            app[method.method()](resource.displayName(), func);
            console.log("\x1b[31m","Method:",method.method(),"resource:",resource.displayName());
        });
    });
});

console.log("\x1b[32m", "Started 2020");

app.listen(2020);
