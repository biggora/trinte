/**
 * Module dependencies.
 */
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var app;

/**
 * Initial bootstrapping
 * @param {Number} port
 * @param {Mixed} path
 */
exports.boot = function(port, path){

    //Create our express instance
    app = require('./app').boot();

    if (cluster.isMaster) {
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('death', function(worker) {
            console.log('worker ' + worker.pid + ' died');
        });
    } else {
        console.log("worker: %s", process.env.NODE_WORKER_ID || "");
        app.listen(parseInt(port));
    }
};