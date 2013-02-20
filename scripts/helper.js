/**
 * Explicit module dependencies
 */
var fs = require('fs'),
inflection = require('../lib/inflection');

/**
 * Add Route on routes.js file.
 * @param {Object} options
 * @param {String} appPath
 * @api public
 */
module.exports.writeRoute = function writeRoute(options, appPath) {
    var rtfile = 'routes.js', path_to_rt;
    var tpl = [], model;

    if(options.model) {
        model = options.model.pluralize().toLowerCase();
    } else {
        return;
    }
    if(options.namespace) {
        tpl.push('       map.namespace("' + options.namespace + '",function(' + options.namespace + '){');
        tpl.push('           ' + options.namespace + '.resources("' + model + '");');
        tpl.push('       });');
    } else {
        tpl.push('       map.resources("' + model + '");');
    }

    path_to_rt = appPath + '/config/' + rtfile;
    if(fs.existsSync(path_to_rt)){
        var crtf = fs.readFileSync(path_to_rt, "utf8");
        var acrtf = crtf.replace(/\r/gim,"").split(/\n/);
        var nacrtf = [];

        if(acrtf.length) {
            acrtf.forEach(function(acrt){
                if(/routes\(map\)/gim.test(acrt)) {
                    console.log(acrt);
                    nacrtf.push(acrt);
                    tpl.forEach(function(tp){
                        nacrtf.push(tp);
                    });
                } else {
                    nacrtf.push(acrt);
                }
            });
            fs.writeFileSync(path_to_rt, nacrtf.join("\n"), "utf8");
        }
    }
};
