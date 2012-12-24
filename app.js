/**
 * Module dependencies.
 */
var fs = require('fs'),
express = require('express'),
mongoose = require('mongoose'),
engine = require('ejs-locals'),
useragent = require('express-useragent'),
sessionStore = require("./utils/session")(express),
helper = require('./utils/helper'),
flash = require('./utils/flash');

var curpath = __dirname.replace(/\\/gi,"/"); // Fix for Windows
var app;

/**
 * Initial bootstrapping
 */
exports.boot = function (params) {

    //Create our express instance
    app = express();

    // Import configuration
    require(curpath + '/conf/configuration.js')(app, express);

    // Initialize params
    require(curpath + '/conf/params.js')(app,curpath);

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
        app.use(express.compress());
        app.use(express.methodOverride());
        app.use(express.bodyParser({
            uploadDir: curpath + '/uploads',
            keepExtensions: true,
            encoding: 'utf-8'
        }));
        app.use(express.cookieParser('secret'));
        app.use(express.session({
            cookie: {
                maxAge: 8640000
            },
            key: 'trinte',
            secret: 'secret',
            store: new sessionStore({ url : app.set('db-uri') })
        }));
        app.use(flash());
        app.use(express.csrf());
        app.use(useragent.express());
        // Before router to enable dynamic routing
        app.use(express.static(curpath + '/public'));

        // Setup ejs views as default, with .html as the extension
        app.set('port', process.env.PORT || 3000);
        app.set('views', curpath + '/views');
        app.engine('html', engine);
        app.set('view engine', 'html');
        app.set('view options', {
            complexNames: true
        });
        app.use(helper.init());
        app.use(app.router);

        // Example 500 page
        app.use(function(err, req, res, next){
            console.log('Internal Server Error: ' + err.message);
            res.status(err.status || 500);
            res.render('500', {
                error: err
            });
        });

        // Example 404 page via simple Connect middleware
        app.use(function (req, res) {
            res.render('404');
        });

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