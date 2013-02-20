var ejs = require('ejs'),
fs = require('fs'),
wrench = require('wrench'),
path = require('path'),
inflection = require('../lib/inflection'),
helper = require('./helper');

/**
 * Script to create a default controller, requires the model to exist
 *
 * @param {Array} params
 * @param {String} appPath
 * @param {Object} options
 */
exports.execute = function(params, appPath, options) {

    var scrPath = appPath + '/app';
    var cntPath = scrPath + '/controllers';

    if(params.length === 0 ) {
        console.log("You must specifiy a model name to generate the controller against!");
        return;
    }
    var modelName = options.model.singularize();
    var namespace = options.namespace ? '/' + options.namespace : null;

    if(namespace) {
       cntPath += namespace;
    }

    /**
     * Create the model based on a singular (e.g. people becomes person, users becomes user)
     */

    if(modelName !== options.model) {
        console.log("Using model name as singular not plural: " + modelName);
    }

    // Capitalize
    modelName = modelName.capitalize();

    var modelFile = scrPath + "/models/" + modelName + '.js';

    var controllerName = modelName.pluralize();

    var controllerFile = cntPath + '/' + controllerName + 'Controller.js';
    var controllerTemplate = __dirname + '/templates/create-controller.template.ejs';

    if(!fs.existsSync(cntPath)) {
       wrench.mkdirSyncRecursive(cntPath,755);
    }

    // Check if the model exists
    var fileCheck = fs.existsSync(modelFile);
    if(!fileCheck) {
        console.log("The controller generator report!");
        console.log("The model you have specified doesn't exist!");
        console.log("You need to create the model first.");
        console.log("e.g. script create-model " + modelName);
        return;
    }

    // Check if the controller exists
    var fileCheck = fs.existsSync(controllerFile);
    if(fileCheck) {
        if(params[0] !== "force") {
            console.log("The controller already exists!");
            console.log("Add an additional paramater of 'force' to over write the controller.");
            console.log("e.g. script create-controller " + modelName + " force");
            console.log("or   g controller " + modelName + " force");
            return;
        }
    }

    var projectdata = {
        name: "",
        description: "",
        version: "",
        author: ""
    };
    if (fs.existsSync(appPath + '/package.json')) {
        var pd = fs.readFileSync(appPath + '/package.json', "utf-8");
        try {
            projectdata = JSON.parse(pd);
        } catch (err) {
        }
    }

    // Read the template
    var str = fs.readFileSync(controllerTemplate, 'utf8');

    // Render the model
    var ret = ejs.render(str, {
        locals: {
            pack: projectdata.name,
            description: projectdata.description,
            version: projectdata.version,
            author: projectdata.author,
            created: new Date().toISOString(),
            controllerName:controllerName,
            modelName:modelName,
            namespace:options.namespace
        },
        open: "<?",
        close: "?>"
    });
    if(!namespace) { namespace = ""; }
    // Write the file
    fs.writeFileSync(controllerFile, ret,'utf8');
    helper.writeRoute(options, appPath);
    console.log('Controller for model ' + modelName + ' created in app' + namespace + '/' + controllerName + 'Controller.js');
};