/**
 * Script to create a model, controller and views
 *
 * @param {Array} params
 * @param {String} appPath
 * @param {Object} options
 */
exports.execute = function(params, appPath, options) {

    if(!options.model) {
        console.log("You must specifiy a model name to generate all of the assets for!");
        return;
    }

    var modelScript = require('./create-model');
    var controllerScript = require('./create-controller');
    var viewScript = require('./create-view');
    var testScript = require('./create-test');

    modelScript.execute(params, appPath, options);
    controllerScript.execute(params, appPath, options);
    viewScript.execute(params, appPath, options);
    testScript.execute(params, appPath, options);
};