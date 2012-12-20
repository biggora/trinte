/**
 * Module dependencies.
 */
var fs = require('fs'),
    express = require('express'),
    mongoose = require('mongoose'),
    nodepath = require('path'),
    engine = require('ejs-locals');

var curpath = __dirname.replace(/\\/gi,"/");
var app;

/**
 * Initial bootstrapping
 */
exports.boot = function (params) {

    //Create our express instance
    app = express();

    // Import configuration
    require(curpath + '/conf/configuration.js')(app, express);

    // Bootstrap application
    bootApplication(app);
    bootModels(app);
    bootControllers(app);

    return app;

};

/**
 *  App settings and middleware
 *  Any of these can be added into the by environment configuration files to
 *  enable modification by env.
 */

function bootApplication(app) {

    app.configure(function () {
        app.use(express.logger({ format: ':method :url :status' }));
        app.use(express.compress());
        app.use(express.bodyParser({
            uploadDir: curpath + '/uploads',
            keepExtensions: true,
            encoding: 'utf-8'
        }));
        app.use(express.methodOverride());
        app.use(express.cookieParser('77ecf30e77123e7ddf1db738eaa437376'));
        app.use(express.session({
            cookie: {
                maxAge: 8640000
            },
            secret: '77ecf30e77123e7ddf1db738eaa437376'
        }));
        app.use(express.static(curpath + '/public'));  // Before router to enable dynamic routing
        app.use(app.router);

        // Example 500 page
        app.use(function(err, req, res){
            console.log('Internal Server Error: ' + err.message);
            res.render('500');
         });

        // Example 404 page via simple Connect middleware
        app.use(function (req, res) {
            res.render('404');
        });

        // Setup ejs views as default, with .html as the extension
        
        app.set('port', process.env.PORT || 3000);
        app.set('views', curpath + '/views');
        app.engine('html', engine);
        app.set('view engine', 'html');
        app.set('view options', {
            complexNames: true
        });

        // Some dynamic view helpers
        app.use(function (){
            return function (req, res, next) {

            function messages() {
                var msgs = req.flash();
                return Object.keys(msgs).reduce(function (arr, type) {
                    return arr.concat(msgs[type]);
                }, []);
            }

            app.locals({
                request: req,
                hasMessages: Object.keys(req.session.flash || {}).length,
                messages: messages()
            });
            next();
        }});
    });
}

//Bootstrap models
function bootModels(app) {

    fs.readdir(curpath + '/models', function (err, files) {
        if (err) throw err;
        files.forEach(function (file) {
            bootModel(app, file);
        });
    });

    // Connect to mongoose
    mongoose.connect(app.set('db-uri'));

}

// Bootstrap controllers
function bootControllers(app) {
    fs.readdir(curpath + '/controllers', function (err, files) {
        if (err) throw err;
        files.forEach(function (file) {
            // bootController(app, file);
        });
    });

    require(curpath + '/controllers/AppController')(app);			// Include

}

// simplistic model support
function bootModel(app, file) {

    var name = file.replace('.js', ''),
        schema = require(curpath + '/models/' + name);				// Include the mongoose file

}

// Load the controller, link to its view file from here
function bootController(app, file) {

    var name = file.replace('.js', ''),
        controller = curpath + '/controllers/' + name,   // full controller to include
        template = name.replace('Controller', '').toLowerCase();									// template folder for html - remove the ...Controller part.

// Include the controller
// require(controller)(app,template);			// Include

}

// allow normal node loading if appropriate
if (!module.parent) {
    exports.boot().listen(3000);
    console.log("Express server %s listening on port %d", express.version, app.address().port)
}