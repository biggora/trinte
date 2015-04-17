/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var config = require('../config/configuration');

exports.load = function load() {
    var locales = {};
    try {
        var files = fs.readdirSync('./config/locales');

        files.forEach(function(file) {
            try {
                if (path.extname(file) === '.yml') {
                    var fileContents = fs.readFileSync('./config/locales/' + file, "utf-8");
                    var locale = yaml.load(fileContents.toString());
                    var lc = path.basename(file, '.yml');
                    locales[lc] = locale;
                }
            } catch (err) {
                console.log("Yaml Error 2: ", err);
            }
        });
    } catch (err) {
        console.log("Yaml Error 1: ", err);
    }
    return locales;
};

exports.translator = function translator() {
    return function(req, res, next) {
        if(req.params.language) {
            if(req.session){
                req.session.language = req.params.language.toString();
            }
        }
        if(req.query.language) {
            if(req.session){
                req.session.language = req.query.language.toString();
            }
        }
        var sess = req.session || {};
        var language = sess.language || config.language || 'en';

        var tran = function(key, defaultValue) {
            var substitute;
            if (typeof global.__lc === 'object') {
                var language = language || config.language || 'en';
                var translation = global.__lc[language];
                if (typeof global.__lc[language] === 'object') {
                    if (typeof key === 'string') {
                        substitute = false;
                    } else {
                        substitute = key;
                        key = substitute.shift();
                    }
                    if (!translation || !key.split('.').every(nextPathItem)) {
                        translation = typeof defaultValue === 'undefined' ? key : defaultValue;
                    }
                    if (translation && substitute && substitute.length) {
                        substitute.forEach(function (substitution) {
                            translation = translation.replace(/%/, substitution.toString().replace(/%/g, ''));
                        });
                    }
                }
            }

            function nextPathItem(token) {
                return (translation = translation[token]);
            }

            return translation;
        };

        if(typeof res.locals === 'function'){
            res.locals({
                t : tran
            })
        } else {
            res.locals.t = tran
        }
        next();
    }
};