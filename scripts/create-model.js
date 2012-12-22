var ejs = require('ejs')
    , fs = require('fs')
    , inflection = require('../lib/inflection');

/**
 * Script to create a default model
 */
exports.execute = function (params, appPath) {
    if (params.length == 0) {
        console.log("You must specifiy a model name.");
        return;
    }

    /**
     * Create the model based on a singular (e.g. people becomes person, users becomes user)
     */
    var modelName = params[0].singularize();
    if (modelName != params[0]) {
        console.log("Creating model using singular not plural: " + modelName);
    }

    // Capitalise
    modelName = modelName.capitalize();

    // Define the files
    var modelFile = appPath + "/models/" + modelName + '.js'
    var modelTemplate = __dirname + '/templates/create-model.template.ejs';

    // Check if it already exists
    var fileCheck = fs.existsSync(modelFile);
    if (fileCheck) {
        if (params[1] != "force") {
            console.log("The model already exists!");
            console.log("Add an additional paramater of 'force' to over write the model.");
            console.log("e.g. script create-model " + modelName + " force");
            return;
        }
    }

    // Read the template
    var str = fs.readFileSync(modelTemplate, 'utf8');
    var fields = [];
    var field = "	  FIELDNAME:{ type: FIELDTYPE }";
    params.slice(1);
    params.forEach(function (param) {
        var wf = param.split(':');
        if (wf[0] != 'force') {
            var cf = field.replace(/FIELDNAME/gi, wf[0]);
            var ct = typeof wf[1] !== undefined ? wf[1] : "String";

            switch (true) {
                case /Number/gi.test(ct):
                case /Int/gi.test(ct):
                case /Integer/gi.test(ct):
                case /Real/gi.test(ct):
                case /Double/gi.test(ct):
                    ct = "Number";
                    break;
                case /Array/gi.test(ct):
                case /Arr/gi.test(ct):
                    ct = "Number";
                    break;
                case /Boolean/gi.test(ct):
                case /Bool/gi.test(ct):
                    ct = "Boolean";
                    break;
                case /String/gi.test(ct):
                case /Text/gi.test(ct):
                    ct = "String";
                    break;
                case /Date/gi.test(ct):
                    ct = "Date";
                    break;
                case /Mixed/gi.test(ct):
                    ct = "Mixed";
                    break;
                case /Buffer/gi.test(ct):
                case /Buf/gi.test(ct):
                    ct = "Buffer";
                    break;
                case /ObjectId/gi.test(ct):
                    ct = "ObjectId";
                    break;
                default:
                    ct = "String";
            }

            cf = cf.replace(/FIELDTYPE/gi, ct)
            fields.push(cf);
        }
    });
    if (!fields.length) {
        fields.push("	  name:{ type: String }");
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
    // Render the model
    var ret = ejs.render(str, {
        locals: {
            name: modelName,
            package: projectdata.name,
            description: projectdata.description,
            version: projectdata.version,
            author: projectdata.author,
            created: new Date().toISOString(),
            fields: fields.join(",\n")
        },
        open: "<?",
        close: "?>"
    });

    // Write the file
    fs.writeFileSync(modelFile, ret, 'utf8');

    console.log('Model ' + modelName + ' created in models/' + modelName + '.js');
};