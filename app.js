#!/usr/bin/env node
var express = require('express'), app;

/**
 * Initial bootstrapping
 */
exports.boot = function () {
    app = module.exports = require('./bin/trinte').createServer();
    return app;
};


// allow normal node loading if appropriate
if (!module.parent) {
    exports.boot().listen(3000);
    console.log("Express server %s listening on port %d", express.version || '3',3000);
}