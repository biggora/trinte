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
exports.execute = function (params, appPath, options) {

    var scrPath = appPath + '/app';
    var cntPath = scrPath + '/controllers';
    var nvwPath = scrPath + '/views';

    if (!options.model) {
        console.log("You must specifiy a model name to generate the controller against!");
        return;
    }
    var modelName = options.model.singularize();
    var namespace = options.namespace ? '/' + options.namespace : null;

    if (namespace) {
        cntPath += namespace;
        nvwPath += namespace;
    }

    /**
     * Create the model based on a singular (e.g. people becomes person, users becomes user)
     */

    if (modelName !== options.model) {
        console.log("Using model name as singular not plural: " + modelName);
    }

    // Capitalize
    modelName = modelName.capitalize();

    var modelFile = scrPath + "/models/" + modelName + '.js';
    var controllerName = modelName.pluralize();
    var controllerFile = cntPath + '/' + controllerName + 'Controller.js';
    var controllerTemplate = "";

    if (!fs.existsSync(cntPath)) {
        wrench.mkdirSyncRecursive(cntPath, 755);
    }

    if (options.action !== "controller") {

        controllerTemplate = __dirname + '/templates/create-controller.template.ejs';
        // Check if the model exists
        var fileCheck = fs.existsSync(modelFile);
        if (!fileCheck) {
            console.log("The controller generator report!");
            console.log("The model you have specified doesn't exist!");
            console.log("You need to create the model first.");
            console.log("e.g. script create-model " + modelName);
            return;
        }
    } else {
        controllerTemplate = __dirname + '/templates/create-controller.empty.ejs';
    }

    // Check if the controller exists
    var fileCheck = fs.existsSync(controllerFile);
    if (fileCheck) {
        if (params[0] !== "force") {
            console.log("The controller already exists!");
            console.log("Add an additional paramater of 'force' to over write the controller.");
            console.log("e.g. script create-controller " + modelName + " force");
            console.log("or   g controller " + modelName + " force");
            return;
        }
    }

    var projectdata = {
        name:"",
        description:"",
        version:"",
        author:""
    };
    if (fs.existsSync(appPath + '/package.json')) {
        var pd = fs.readFileSync(appPath + '/package.json', "utf-8");
        try {
            projectdata = JSON.parse(pd);
        } catch (err) {
        }
    }

    if (!namespace) {
        namespace = "";
    }
    var actions = [];
    var action = "";
    action += "    /**\n";
    action += "    * CACTION action\n";
    action += "    * @param {Object} req\n";
    action += "    * @param {Object} res\n";
    action += "    * @param {Function} next\n";
    action += "    **/\n";
    action += "    'CACTION': function(req, res, next) {\n";
    action += "           var title = 'CONTROLLER';\n";
    action += "           res.render(ViewTemplatePath + '/CACTION', { title : title });\n";
    action += "    }";

    // Write the files
    if (options.action === "controller") {
        var viewEmptyTemplate = __dirname + '/templates/create-view.template.empty.ejs';
        var viewFolder = nvwPath + "/" + controllerName.toLowerCase();
        var tmpEmptyView = fs.readFileSync(viewEmptyTemplate, 'utf8');
        if(!fs.existsSync(viewFolder)) {
            wrench.mkdirSyncRecursive(viewFolder,755);
        }
        if(params.length === 0 || (params.length === 1 && params[0] === 'force')) {
            params = ['index'];
        }
        params.forEach(function (param) {
            var wf = param.split(':');
            if (wf[0] !== 'force') {
                var cf = action.replace(/CACTION/gi, wf[0]);
                cf = cf.replace(/CONTROLLER/gi, controllerName);
                actions.push(cf);

                // Render the view
                var vret = ejs.render(tmpEmptyView, {
                    locals:{
                        pack:projectdata.name,
                        description:projectdata.description,
                        version:projectdata.version,
                        author:projectdata.author,
                        created:new Date().toISOString(),
                        controllerName:controllerName,
                        modelName:modelName,
                        namespace:options.namespace,
                        controllerAction:wf[0]
                    },
                    open:"<?",
                    close:"?>"
                });

                fs.writeFileSync(viewFolder + "/" + wf[0] + ".ejs", vret, 'utf8');
            }
        });
    }
    var fields = [];
    params.forEach(function (param) {
        var wg = param.split(':');
        if (wg[0] !== 'force' && wg[0] !== modelName) {
            fields.push({
                param_name:wg[0].capitalize(),
                param_val:wg[0]
            });
        }
    });

    if (!fields.length) {
        fields.push({
            param_name:"Name",
            param_val:"name"
        });
    }
    // Read the template
    var str = fs.readFileSync(controllerTemplate, 'utf8');

    // Render the model
    var ret = ejs.render(str, {
        locals:{
            pack:projectdata.name,
            description:projectdata.description,
            version:projectdata.version,
            author:projectdata.author,
            created:new Date().toISOString(),
            controllerName:controllerName,
            modelName:modelName,
            namespace:options.namespace,
            controllerActions:actions.join(",\n"),
            fields:fields
        },
        open:"<?",
        close:"?>"
    });

    fs.writeFileSync(controllerFile, ret, 'utf8');
    helper.writeRoute(options, appPath);
    console.log('Controller for model ' + modelName + ' created in app' + namespace + '/' + controllerName + 'Controller.js');
};