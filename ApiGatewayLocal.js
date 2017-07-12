const Express = require("express");
const BodyParser = require("body-parser");
const RamlParser = require('raml-1-parser');

const app = new Express();

app.use(BodyParser.json());

const port = process.env.port || 2020;

const raml_file = RamlParser.loadApi("run.raml");

const traits = [];
const methods = [];

const watchingFile = function(arr_trait){
    try{
        fs.watch((arr_trait+".js"), function (event, filename) {
            var file = files[filename];
            delete require.cache[require.resolve(file)]
            console.log('File:' + filename + " refreshed!");
        });
    }catch(e){console.log(e);}
};

app.options((request, response)=>{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "*");
    response.status(200).send();
})

const processTraits = function(raml){
    raml.traits().forEach((trait)=>{
        var f = function(req, res){
            const context = {"res":res, "done": function(err, data){
                if(err){
                    console.log("\x1b[31m","Data:",err);
                    res.status(500).send(err);
                }else{
                    console.log("\x1b[32m","Data:",data);
                    res.status(200).send(data);
                }

            }};
            const arr_trait = trait.name().split("#");
            const req_file = require(arr_trait[0]+".js");
            req_file[arr_trait[1]](req['body'], context);
        }
        traits[trait.name()] = f;
    });

}

raml_file.then((raml)=>{
    processTraits(raml);

    raml.resources().forEach((resource)=>{
        resource.methods().forEach((method)=>{
            console.log(method.method());
            console.log(method.is()[0].name());
            var func = traits[method.is()[0].name()];
            app[method.method()](resource.displayName(), func);
            console.log("\x1b[33m","[Resource] Method:",method.method(),"resource:",resource.displayName());
        });
    });
    console.log("\x1b[0m","");
});

console.log("\x1b[32m", "Initialized at Port: "+port);

app.listen(port);
