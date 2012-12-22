/**
 * Default params manager
 * Inject app and express reference
 */
var fs = require('fs');

module.exports = function (app, curpath) {
    var controllers = [];
    var files = fs.readdirSync(curpath + "/controllers");

    files.forEach(function (file) {
        if (file != "AppController.js" && /Controller\.js/.test(file)) {
            controllers.push(file.replace('Controller.js', '').toLowerCase());
        }
    });

    app.param(function (name, fn) {
        if (fn instanceof RegExp) {
            return function (req, res, next, val) {
                var captures = fn.exec(String(val));
                if (captures && name == 'controller' && controllers.indexOf(val)) {
                    req.params[name] = captures.toString();
                    next();
                } else if (captures) {
                    req.params[name] = captures.toString();
                    next();
                } else {
                    next('route');
                }
            }
        }
    });

    app.configure(function () {
        app.param('id', /^[A-Za-z0-9]+$/);
        app.param('controller', /^[a-zA-Z]+$/);
        app.param('action', /^[a-zA-Z]+$/);
        app.param('format', /^[a-zA-Z]+$/);
        app.param('from', /^\d+$/);
        app.param('to', /^\d+$/);
    });

}