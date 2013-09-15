#!/usr/bin/env node
var express = require('express'), config = require('./config/configuration'), app;

process.env.PORT = config.port;

/**
 * Initial bootstrapping
 */
exports.boot = function () {
    app = module.exports = require('./bin/trinte').createServer();
    return app;
};

// allow normal node loading if appropriate
if (!module.parent) {
    exports.boot().listen(process.env.PORT);
    console.log("TrinteJS server listening on port %d!", process.env.PORT);
}