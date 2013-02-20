/**
 * Module dependencies.
 */
var fs = require('fs');
var express = require('express');
var events = require('events');
var params = require('./params');
var envConf = require('../config/environment');
var config = require('../config/configuration');
var database = require('../config/database');
var Resource = require('./router').Resource;
var util = require('util');
var utils = require('./utils');
var http = require('http');
var flash = require('./flash');
var helper = require('./helper');
var engine = require('ejs-locals');


function TrinteJS(app, root) {
    app.trinte = this;
    this.__defineGetter__('rootModule', function() {
        return module.parent;
    });
    this.app = app;
    this.root = app.root = root;
    this.utils = utils;

    this.helpers = {};
    this.models = {};
    // this.controllerExtensions = {};
    // this.middleware = middleware;

    this.server = http.createServer(app);

    app.listen = function(port, host, cb) {
        this.server.listen(port, host, cb);
    }.bind(this);
}

util.inherits(TrinteJS, events.EventEmitter);
/**
 * Initialize trinte application:
 *
 *  - load modules
 *  - run configurators (conf/environment, conf/env/{env})
 *  - init controllers
 *  - init extensions (including ORM and db/schema)
 *  - init assets compiler
 *  - init models
 *  - add routes
 *  - start http server
 *  - locales
 *  - loggers
 *  - observers
 *  - assets
 *
 * @param {Object} app - express server, may contain optional `root` member.
 * @param {String} root
 * @return {TrinteJS} trinte - trinte app descriptor.
 */
exports.init = function init(app, root) {
    // create API publishing object
    var trinte = new TrinteJS(app, root || process.cwd());
    var map = new Resource(app);

    configureApp(trinte);
    bootModels(trinte);

    trinte.on('models_loaded', function() {
        require('../app/helpers/ModelsHelper');
        require('../app/helpers/ApplicationHelper');
        trinte.emit('helpers_loaded');
    });

    trinte.on('helpers_loaded', function() {
        require('../config/routes')(map);
        trinte.emit('routes_loaded');
    });

    trinte.on('routes_loaded', function() {
        global.pathTo = map.pathTo;
        // console.log(map.pathTo);
    });

    // everything else can be done after starting server
    process.nextTick(function() {
        trinte.helpers['views'] = require('../app/helpers/ViewsHelper');
    });

    return trinte;
};

/**
 * Create http server object. Automatically hook up SSL keys stored in
 * app.root/config/tsl.{cert|key}
 *
 * @param {Object} options - example:
 *   {root: __dirname, any other options for express}.
 * @return {Function} express server.
 */
exports.createServer = function(options) {
    options = options || {};
    if (typeof options === 'string') {
        options = {
            root: options
        };
    }
    var root = options.root || process.cwd();
    delete options.root;

    var app = express(options);

    exports.init(app, root);

    app.express2 = !!express.version.match(/^2/);
    app.express3 = !!express.version.match(/^3/);

    return app;
};


// Bootstrap models
function bootModels(trinte) {
    var Schema = require('caminte').Schema,
    schema = new Schema(database.db.driver, database.db);

    fs.readdir('./app/models', function(err, files) {
        if (err) {
            console.log(err);
        }
        if (!files) {
            trinte.emit('models_loaded');
        }

        var count = files.length;
        if (count > 0) {
            files.forEach(function(file) {
                bootModel(trinte, schema, file);
                if (--count === 0) {
                    trinte.emit('models_loaded');
                }
            });
        } else {
            trinte.emit('models_loaded');
        }
    });
}

// simplistic model support
function bootModel(trinte, schema, file) {
    var name = file.replace(/\.js$/i, '');
    trinte.models[name] = require('../app/models/' + name)(schema);// Include the mongoose file
    global[name] = trinte.models[name];
}

/**
 * Run app configutators in `conf/` and `conf/env`.
 * Also try to monkey patch ejs and jade. **weird**
 * @param {TrinteJS} trinte - trinte app descriptor.
 */
function configureApp(trinte) {
    var app = trinte.app;
    var root = trinte.root;

    app.configure(function() {
        params.extend(app);
        envConf(app, express);
        app.use(express.bodyParser({
            uploadDir: root + '/uploads',
            keepExtensions: true,
            encoding: config.parser.encoding
        }));
        app.use(express.methodOverride());
        app.use(express.cookieParser(config.session.secret));
        require('../config/session')(app, express);

        // Before router to enable dynamic routing
        app.use(express['static'](root + '/public'));
        app.use(function(req, res, next) {
            res.setHeader('X-Powered-By', 'TrinteJS');
            next();
        });
        // Setup ejs views as default, with .ejs as the extension
        app.set('port', process.env.PORT || config.port);
        app.set('views', root + '/app/views');
        app.engine('ejs', engine);
        app.set('view engine', 'ejs');
        app.set('view options', {
            complexNames: true
        });

        require('../config/middleware')(app, express);
        app.use(flash());
        app.use(express.csrf());
        app.use(helper.init());

        app.use(app.router);

        // Example 500 page
        app.use(function(err, req, res, next) {
            console.log('Internal Server Error: ' + err.message);
            res.status(err.status || 500);

            if(parseInt(err.status) === 403) {
                res.render('errors/403');
            } else if (parseInt(err.status) === 401) {
                res.render('errors/401');
            } else {
                res.render('errors/500', {
                    error: err
                });
            }
        });

        // Example 404 page via simple Connect middleware
        app.use(function(req, res) {
            res.render('errors/404');
        });

        // Initialize users params
        require('../config/params')(app);
    });
}