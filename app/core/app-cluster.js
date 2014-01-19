/**
 * Module dependencies.
 */
var cluster = require('cluster');
var config = require('./config/configuration');
var numCPUs = require('os').cpus().length;
var app;

/**
 * Initial bootstrapping
 * @param {Number} port
 */
exports.boot = function(port) {
    process.env.PORT = port || config.port || 3000;
    if (!process.env.CLUSTER) {
        console.log('App Launching in cluster mode on port: ' + process.env.PORT);
        console.log('Workers count: ' + numCPUs);
        process.env.CLUSTER = true;
    }
    //Create our express instance
    app = require('./app').boot(process.env.PORT, process.env.CLUSTER);

    cluster.on('fork', function(worker) {
        console.log("Start worker: %s online", worker.process.pid || "");
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker: %s died', worker.process.pid || "");
    });

    if (cluster.isMaster) {
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            if (i > 0) {
                process.env.AUTOUPDATE = true;
            }
            cluster.fork();
        }
    } else {
        app.listen(process.env.PORT);
    }
};