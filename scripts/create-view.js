var ejs = require('ejs'),
    fs = require('fs'),
    wrench = require('wrench'),
    path = require('path'),
    inflection = require('../lib/inflection');

/**
 * Script to create a default view, requires the model to exist
 *
 * @param {Array} params
 * @param {String} appPath
 * @param {Object} options
 */
exports.execute = function (params, appPath, options) {

    var scrPath = appPath + '/app';
    var cvwPath = scrPath + '/views';
    var nvwPath = scrPath + '/views';
    var fileCheck;

    if (!options.model || options.model === "") {
        console.log("You must specifiy a model name to generate the views against!");
        return;
    }

    var modelName = options.model.singularize();
    var namespace = options.namespace ? '/' + options.namespace : null;

    if (namespace) {
        nvwPath += namespace;

        if (!fs.existsSync(nvwPath)) {
            wrench.mkdirSyncRecursive(nvwPath);
        }
        if (!fs.existsSync(nvwPath + "/default_layout.ejs")) {
            var coreView = options.bootstrapPath + '/app/app/views';

            fs.createReadStream(coreView + '/default_layout.ejs').pipe(fs.createWriteStream(nvwPath + '/default_layout.ejs'));
            fs.createReadStream(coreView + '/errors_layout.ejs').pipe(fs.createWriteStream(nvwPath + '/errors_layout.ejs'));
            fs.createReadStream(coreView + '/messages.ejs').pipe(fs.createWriteStream(nvwPath + '/messages.ejs'));
            fs.createReadStream(coreView + '/login.ejs').pipe(fs.createWriteStream(nvwPath + '/login.ejs'));
            fs.createReadStream(coreView + '/footer.ejs').pipe(fs.createWriteStream(nvwPath + '/footer.ejs'));
            fs.createReadStream(coreView + '/header.ejs').pipe(fs.createWriteStream(nvwPath + '/header.ejs'));
            wrench.copyDirSyncRecursive(coreView + '/errors', nvwPath + '/errors');

            try {
                wrench.rmdirSyncRecursive(nvwPath + '/app');
            } catch(err) {

            }
        }
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
    var viewFolder = nvwPath + "/" + controllerName.toLowerCase();
    var viewIndexTemplate = __dirname + '/templates/create-view.template.index.ejs';
    var viewEditTemplate = __dirname + '/templates/create-view.template.edit.ejs';
    var viewShowTemplate = __dirname + '/templates/create-view.template.show.ejs';
    var viewFormTemplate = __dirname + '/templates/create-view.template.form.ejs';
    var viewNewTemplate = __dirname + '/templates/create-view.template.new.ejs';

    // Check if the model exists
    fileCheck = fs.existsSync(modelFile);
    if (!fileCheck) {
        console.log("The views generator report!");
        console.log("The model you have specified doesn't exist!");
        console.log("You need to create the model first.");
        console.log("e.g. script create-model " + modelName);
        return;
    }

    // Check if the view exists
    fileCheck = fs.existsSync(viewFolder);
    if (fileCheck) {
        if (params[0] !== "force") {
            console.log("The views folder already exists for this model!");
            console.log("Add an additional paramater of 'force' to over write the views.");
            console.log("e.g. script create-view " + modelName + " force");
            return;
        }
    } else {
        wrench.mkdirSyncRecursive(viewFolder, 755);
    }

    // Read the template
    var tmpIndex = fs.readFileSync(viewIndexTemplate, 'utf8');
    var tmpForm = fs.readFileSync(viewFormTemplate, 'utf8');
    var tmpEdit = fs.readFileSync(viewEditTemplate, 'utf8');
    var tmpShow = fs.readFileSync(viewShowTemplate, 'utf8');
    var tmpNew = fs.readFileSync(viewNewTemplate, 'utf8');

    var fields = [];
    params.forEach(function (param) {
        var wf = param.split(':');
        if (wf[0] !== 'force' && wf[0] !== modelName) {
            fields.push({
                param_name:wf[0].capitalize(),
                param_val:wf[0]
            });
        }
    });

    if (!fields.length) {
        fields.push({
            param_name:"Name",
            param_val:"name"
        });
    }

    var locals = {
        fields:fields,
        modelName:modelName,
        controllerName:controllerName,
        namespace:options.namespace
    };

    // Render the views
    var retIndex = ejs.render(tmpIndex, { locals:locals, open:"<?", close:"?>" });
    var retEdit = ejs.render(tmpEdit, { locals:locals, open:"<?", close:"?>" });
    var retNew = ejs.render(tmpNew, { locals:locals, open:"<?", close:"?>" });
    var retShow = ejs.render(tmpShow, { locals:locals, open:"<?", close:"?>" });
    var retForm = ejs.render(tmpForm, { locals:locals, open:"<?", close:"?>" });

    // Write the file
    fs.writeFileSync(viewFolder + "/index.ejs", retIndex, 'utf8');
    fs.writeFileSync(viewFolder + "/edit.ejs", retEdit, 'utf8');
    fs.writeFileSync(viewFolder + "/show.ejs", retShow, 'utf8');
    fs.writeFileSync(viewFolder + "/form.ejs", retForm, 'utf8');
    fs.writeFileSync(viewFolder + "/new.ejs", retNew, 'utf8');

    if (options.anyside && options.namespace) {

        // here check template name

        // view filenames
        var AnyviewIndexTemplate = __dirname + '/templates/create-view.template.client.index.ejs';
        var AnyviewShowTemplate = __dirname + '/templates/create-view.template.client.show.ejs';

        // Read the template
        var AnytmpIndex = fs.readFileSync(AnyviewIndexTemplate, 'utf8');
        var AnytmpShow = fs.readFileSync(AnyviewShowTemplate, 'utf8');

        // Render the views
        var AnyretIndex = ejs.render(AnytmpIndex, { locals:locals, open:"<?", close:"?>" });
        var AnyretShow = ejs.render(AnytmpShow, { locals:locals, open:"<?", close:"?>" });

        // Write the file
        fs.writeFileSync(cvwPath + "/" + controllerName.toLowerCase() + "/index.ejs", AnyretIndex, 'utf8');
        fs.writeFileSync(cvwPath + "/" + controllerName.toLowerCase() + "/show.ejs", AnyretShow, 'utf8');

        console.log('Views ' + modelName + ' created in app/views/' + modelName.toLowerCase());
    }
    if (!namespace) {
        namespace = "";
    }
    console.log('Views ' + modelName + ' created in app/views' + namespace + '/' + modelName.toLowerCase());
};