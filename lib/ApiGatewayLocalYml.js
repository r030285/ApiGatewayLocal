const Express = require("express");
const BodyParser = require("body-parser");
const RamlParser = require('raml-1-parser');
const Yaml = require('yamljs');


const app = new Express();

module.exports.start = (argv) =>{
    app.use(BodyParser.json());

    var args = buildArgs(argv);
    let yaml_file = Yaml.load(args.file);

    generateCors(app);

    const methods = Object.keys(yaml_file.actions).map((d)=>{yaml_file.actions[d].resource = d; return yaml_file.actions[d] });

    methods.forEach((action)=>{
        let f = buildFunctionMethod(action);
        app[action.method](action.resource, f);
        console.log("\x1b[33m","[Resource] Method:",action.method,"resource:",action.resource,"\x1b[0m");
    });
    console.log("\x1b[32m", "Initialized at Port: "+args.port,"\x1b[0m");
    app.listen(args.port);
}

const buildArgs = function(argv){
    let args = {"file":"run.yml", "port":2020};

    let file_index;
    let port_index;
    for(let i=0;i<process.argv.length;i++){
        if(process.argv[i].indexOf("--file")>-1){
            args["file"] = process.argv[i+1];
            continue;
        }
        if(process.argv[i].indexOf("--port")>-1){
            args["port"] = process.argv[i+1];
            continue;
        }
    }
    return args;
}


const generateCors = function(app){
    app.options("/*", (request, response) => {
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Headers", "Content-type");
      response.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS");
      response.header("Access-Control-Request-Method","GET, POST, PUT, DELETE, OPTIONS");
      response.status(200);
      response.send();
      return;
    });
}

const buildFunctionMethod =function(action, body){
    return (req, res)=>{
        if(req.query)
            req['body'] = req.query;

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
        const req_file = require(process.cwd()+action.file);
        req_file[action.handler](req['body'], context);
    }
}
