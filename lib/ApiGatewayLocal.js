const Express = require("express");
const BodyParser = require("body-parser");
const cors = require("cors");

const RamlParser = require('raml-1-parser');

const app = new Express();

app.use(cors());

module.exports.start = (argv) =>{
    app.use(BodyParser.json());

    var args = argv.slice(2);

    let port = 2020;
    let raml_file = null;

    const getDataArgv = function(data){
        const arg = data.split();
        if(arg.length>1){
            return arg[1];
        }else{
            return null;
        }
    }

    argv.forEach((data)=>{

        if(data.indexOf("--file")>-1){
            var file = getDataArgv(data);
            raml_file = RamlParser.loadApi((file?file:"run.raml"));
        }
        if(data.indexOf("--port")>-1){
            port = getDataArgv(data);
            port = port?port:2020;
        }
    });

    const traits = [];

    // TODO: watching Files
    const watchingFile = function(arr_trait){
        try{
            fs.watch((arr_trait+".js"), function (event, filename) {
                var file = files[filename];
                delete require.cache[require.resolve(file)]; // TODO: clean cache
                console.log("\x1b[33m",'File:' + filename + " refreshed!");
            });
        }catch(e){console.log("\x1b[31m",e.message);}
    };

    const processTraits = function(raml){
        raml.traits().forEach((trait)=>{
            var f = function(req, res){
                const context = {"res":res, "done": function(err, data){
                    res.header("Access-Control-Allow-Origin", "*");

                    if(err){
                        console.log("\x1b[31m","Data:",err,"\x1b[0m");
                        res.status(500).send(err);
                    }else{
                        console.log("\x1b[32m","Data:",data,"\x1b[0m");
                        res.status(200).send(data);
                    }

                }};
                const arr_trait = trait.name().split("#");
                const req_file = require(process.cwd()+"/"+arr_trait[0]+".js");
                req_file[arr_trait[1]](req['body'], context);
            }
            traits[trait.name()] = f;
        });

    }

    raml_file.then((raml)=>{
        processTraits(raml);

        raml.resources().forEach((resource)=>{
            resource.methods().forEach((method)=>{
                var func = traits[method.is()[0].name()];
                app[method.method()](resource.displayName(), func);
                console.log("\x1b[33m","[Resource] Method:",method.method(),"resource:",resource.displayName(),"\x1b[0m");
            });
        });
    });

    console.log("\x1b[32m", "Initialized at Port: "+port,"\x1b[0m");

    app.listen(port);
}
