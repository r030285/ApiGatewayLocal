


module.exports.main = (event, context) => {
    console.log(event);
    context.done(null, {"teste":"OK"});
}
