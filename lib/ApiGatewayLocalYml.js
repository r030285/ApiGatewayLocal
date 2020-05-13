const Express = require("express");
const BodyParser = require("body-parser");
const Yaml = require('yamljs');
const cors = require("cors");
const fs = require("fs");

const app = new Express();
app.use(cors());
app.use(BodyParser.json());

app.all("/*",(req, reponse, next)=>{
    let json = {
        "body-json": req.body?req.body:{},
        "params": {
            "path": {},
            "querystring": req.query,
            "header": req.headers
        }
    };
    try{
        req.bodyChange = json;
    }catch(e){
        console.log(e);
    }
    return next();
})

module.exports.start = (argv) =>{
    var args = buildArgs(argv);
    let yaml_file = Yaml.load(args.file);


    const methods = Object.keys(yaml_file.actions).map((d)=>{yaml_file.actions[d].resource = d; return yaml_file.actions[d] });

    methods.forEach((action)=>{
        
        if(action.method){
            let f = buildFunctionMethod(action);
            app[action.method](action.resource, f);
        }else{
            
            action.method="";
            Object.keys(action).forEach((method)=>{
                console.log(method);
                if(method!=="resource" && method!=="method"){
                    action.method+= action.method?" ":"";
                    action.method+=method;
                    let f = buildFunctionMethod(action[method]);
                    
                    app[method](action.resource, f);
                }
            });
        }
        
        console.log("\x1b[33m","[Resource] Method:",action.method,"resource:",action.resource,"\x1b[0m");
    });
    console.log("\x1b[32m", "Initialized at Port: "+args.port,"\x1b[0m");
    app.listen(args.port);
}

const buildArgs = function(){
    let args = {"file":"run.yml", "port":2020};

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


const buildFunctionMethod =function(action){
    return (req, res)=>{
        

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

        fs.realpath(action.file,(err,path)=>{
                const req_file = require(path);
                req_file[action.handler](req.bodyChange, context);                    
            }
        )
    }
}
