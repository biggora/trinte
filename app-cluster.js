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
exports.boot = function(port) {

    //Create our express instance
    app = require('./app').boot();

    if (cluster.isMaster) {
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('online', function(worker) {
            console.log('Worker ' + worker.process.pid + ' is online.');
        });
        cluster.on('death', function(worker) {
            console.log('worker ' + worker.process.pid + ' died');
        });
        cluster.on('exit', function(worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died.');
        });

    } else {
        console.log("worker: %s", process.pid || "");
        app.listen(parseInt(port));
    }
};