/**
 * TrinteJS MVC Bootstrap
 *
 * @project  trinte
 * @author   Alexey Gordeyev
 * @created  2013-09-27 07:25:26
 * @Params - cmd - server | script | params
 *
 */

/**
 * Explicit module dependencies
 */
var npm = require("npm");
var creator = require('trinte-creator');

/**
 * Main Installer
 * @param {Object} params
 */
exports.installModule = function (params) {
    var module = params.name;
    var modules = [params.name];
    switch (params.name) {
        case 'authorization':
            module = 'trinte-auth';
            modules = [
                'trinte-auth',
                'pause',
                'pkginfo',
                'passport',
                'passport-local',
                'passport-strategy'
            ];
            break;
        case 'uploader':
            module = 'express-uploader';
            modules = [
                'express-uploader',
                'gm',
                'uuid'
            ];
            break;
        default:
    }

    npm.load(params, function (err) {
        if (err) {
            return console.log(err);
        }
        npm.commands.install(modules, function (err, data) {
            if (err) {
                return console.log(err);
            }
            var instPath = './node_modules/' + module + '/install.js';
            try {
                require(instPath);
            } catch(err) {
            }
            // command succeeded, and data might have some info
        });
        npm.on("log", function (message) {
            // console.log(message);
        });
    });
};
