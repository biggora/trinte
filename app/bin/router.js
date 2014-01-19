var inflection = require('../app/lib/inflection');
var fs = require('fs');
var path = require('path');
var fileExists = fs.existsSync || path.exists;

exports.Resource = Resource;

/**
 * Routing map drawer. Encapsulates all logic required for drawing maps:
 * namespaces, resources, get, post, put, ..., all requests
 *
 * @param {Object} app - TrinteJS application
 * routing map to application
 */
function Resource(app) {
    if (!(this instanceof Resource)) return new Resource(app, TrinteBridge);
    this.app = app;
    this.bridge = TrinteBridge;
    this.paths = [];
    this.ns = '';
    this.globPath = '/';
    this.pathTo = {};
    this.dump = [];
    this.middlewareStack = [];
    this.middleware = [];
}

/**
 * Some TrinteBridge method that will server requests from
 * routing map to application
 *
 * @param {String} namespace
 * @param {String} controller
 * @param {String} action
 * @return {Function} responseHandler
 */

function TrinteBridge(namespace, controller, action) {
    var responseHandler;
    if (typeof action === 'function') {
        return action;
    }
    try {
        if (/\//.test(controller)) {
            var cnts = controller.split('/');
            namespace = cnts[0] + '/';
            controller = cnts[1];
        }
        namespace = typeof namespace === 'string' ? namespace.toString().toLowerCase() : '';
        controller = controller.pluralize().capitalize();
        var ctlFileA = './../app/controllers/' + namespace + controller + 'Controller';
        var ctlFileB = './../app/controllers/' + namespace + controller + 'esController';
        var ctlFileC = './../app/controllers/' + namespace + controller + 'sesController';

        if (fileExists(path.resolve(__dirname, ctlFileA) + '.js')) {
            responseHandler = require(ctlFileA)[action];
        } else if (fileExists(path.resolve(__dirname, ctlFileB) + '.js')) {
            responseHandler = require(ctlFileB)[action];
        } else {
            responseHandler = require(ctlFileC)[action];
        }
    } catch (e) {
        // console.log( 'Route Action: ' + action );
        console.log(e);
    }

    return responseHandler || function (req, res) {
        res.send('bridge not found for ' + namespace + controller + '#' + action);
    };
}

/**
 * Calculate url helper name for given path and action
 *
 * @param {String} path
 * @param {String} action
 * @return {String} helperName
 */
Resource.prototype.urlHelperName = function (path, action) {
    if (path instanceof RegExp) {
        path = path.toString().replace(/[^a-z]+/ig, '/');
    }

    // handle root paths
    if (path === '' || path === '/') return 'root';

    // remove trailing slashes and split to parts
    path = path.replace(/^\/|\/$/g, '').split('/');

    var helperName = [];
    path.forEach(function (token, index, all) {
        // skip variables
        if (token[0] === ':') return;

        var nextToken = all[index + 1] || '';

        // current token is last?
        if (index === all.length - 1) {
            token = token.replace(/\.:format\??$/, '');

            if (token === action) {
                helperName.unshift(token);
                return;
            } else {

            }
        }

        if ((nextToken[0] === ':' && nextToken !== ':from-:to.:format?') || nextToken === 'new.:format?') {
            token = token.singularize() || token;
        } else if (action === "destroyall") {
            token = token.pluralize() || token;
        }
        switch (action) {
            case "create":
            case "show":
            case "destroy":
            case "update":
                helperName.unshift(action);
                break;
            case "destroyall":
                helperName.unshift("destroy");
                break;
            case "index":
                if (/:from/.test(nextToken)) {
                    helperName.unshift("paging");
                }
                break;
            default:
        }
        helperName = helperName.filter(function (el, i, a) {
            if (i === a.indexOf(el))return 1;
            return 0;
        });
        helperName.push(token);
    });
    return helperName.join('_');
};

/**
 * Resource root url
 * @param {Function} handler
 * @param {Function|Array} middleware
 * @param {Object} options
 */
Resource.prototype.root = function (handler, middleware, options) {
    this.get('/', handler, middleware, options);
};

['get', 'post', 'put', 'delete', 'del', 'all'].forEach(function (method) {
    Resource.prototype[method] = function (subpath, handler, middleware, options) {

        var controller, action;
        if (typeof handler === 'string') {
            controller = handler.split('#')[0];
            action = handler.split('#')[1];
        } else if (typeof handler === 'function') {
            action = handler;
        }

        var path;

        if (typeof subpath === 'string') {
            path = this.globPath + subpath.replace(/^\/|\/$/, '');
        } else { // regex???
            path = subpath;
        }

        // only accept functions in before filter when it's an array
        if (middleware instanceof Array) {
            var before_filter_functions = middleware.filter(function (filter) {
                return (typeof filter === 'function');
            });
            middleware = before_filter_functions.length > 0 ? before_filter_functions : null;
        }

        if (!(typeof middleware === 'function' || (middleware instanceof Array)) && typeof options === 'undefined') {
            options = middleware;
            middleware = null;
        }

        if (!options) {
            options = {};
        }
        path = options.collection ? path.replace(/\/:.*_id/, '') : path;

        var args = [path];
        if (middleware) {
            args = args.concat(this.middlewareStack.concat(middleware));
        } else if (this.middlewareStack.length) {
            args = args.concat(this.middlewareStack);
        }
        if (typeof controller === 'undefined' && typeof  action === 'undefined') {
            if (handler instanceof Array) {
                middleware = [];
                for (var i in handler) {
                    if (i < (handler.length - 2)) {
                        middleware.push(handler[i]);
                    } else {
                        action = handler[i];
                    }
                }
                args = args.concat(this.middlewareStack.concat(middleware));
            }
        }

        args = args.concat(this.bridge(this.ns, controller, action, options));

        this.dump.push({
            helper: options.as || this.urlHelperName(path, action),
            method: method,
            path: path,
            file: this.ns + controller,
            name: controller,
            action: action
        });
        this.addPath(path, action, options.as);
        this.app[method].apply(this.app, args);

        if (method.toLowerCase() === 'get' && action === 'index') {
            /(.*).:format?/i.test(path);
            var pagingPath = RegExp.$1 + '/:from-:to.:format?';
            // options.as = 'paging_' + controller;
            this.dump.push({
                helper: options.as || this.urlHelperName(pagingPath, action),
                method: method,
                path: pagingPath,
                file: this.ns + controller,
                name: controller,
                action: action
            });
            this.addPath(pagingPath, action, options.as);
            args[0] = pagingPath;
            this.app[method].apply(this.app, args);
        }
    };
});

/**
 * Add path helper to `pathTo` collection
 * @param {String} templatePath
 * @param {Function} action
 * @param {String} helperName
 */
Resource.prototype.addPath = function (templatePath, action, helperName) {
    var app = this.app;

    if (templatePath instanceof RegExp) {
        // TODO: think about adding to `path_to` routes by reg ex
        return;
    }
    var paramNames = [];
    var paramsLength = templatePath.match(/\/:\w*|\-:\w*/g);
    if (paramsLength) {
        paramNames = paramsLength.map(function (p) {
            return p.substr(2);
        });
    }
    paramsLength = paramsLength === null ? 0 : paramsLength.length;
    // /\/:\w*\?/
    var optionalParamsLength = templatePath.match(/:\w*/g);

    if (optionalParamsLength) {
        optionalParamsLength = optionalParamsLength ? optionalParamsLength.length : 0;
    }

    helperName = helperName || this.urlHelperName(templatePath, action);
    // already defined? not need to redefine
    if (helperName in this.pathTo) return;

    this.pathTo[helperName] = function (objParam) {
        // TODO: thing about removing or rewriting it
        // if (arguments.length < (paramsLength - optionalParamsLength) || ) {
        // return '';
        // throw new Error('Expected at least ' + paramsLength + ' params for build path ' + templatePath + ' but only ' + arguments.length + ' passed');
        // }

        var value, arg, path = templatePath;

        for (var i = 0; i < paramsLength; i += 1) {
            value = null;
            arg = arguments[i];
            if (arg && typeof arg.to_param === 'function') {
                value = arg.to_param();
            } else if (arg && typeof arg === 'object' && arg.id && arg.constructor.name !== 'ObjectID') {
                value = arg.id;
            } else if (paramNames[i] && objParam && objParam[paramNames[i]]) {
                value = objParam[paramNames[i]];
            } else {
                value = arg && arg.toString ? arg.toString() : arg;
            }
            var matchOptional = path.match(/:(\w*\??)/);
            if (matchOptional && matchOptional[1].substr(-1) === '?' && !value) {
                path = path.replace(/\/:\w*\??/, '');
            } else {
                path = path.replace(/:\w*\??/, '' + value);
            }
        }
        if (arguments[paramsLength]) {
            var query = [];
            for (var key in arguments[paramsLength]) {
                if (key === 'format' && path.match(/\.:format\??$/)) {
                    path = path.replace(/\.:format\??$/, '.' + arguments[paramsLength][key]);
                } else {
                    query.push(key + '=' + arguments[paramsLength][key]);
                }
            }
            if (query.length) {
                path += '?' + query.join('&');
            }
        }

        path = path.replace(/\.:format\?/, '');
        // add ability to hook url handling via app
        if (this.app.hooks && this.app.hooks.path) {
            this.app.hooks.path.forEach(function (hook) {
                path = hook(path);
            });
        }
        var appprefix = '';
        if (app.path) {
            appprefix = app.path();
        } else {
            appprefix = app.set('basepath') || '';
        }
        return appprefix + path;
    }.bind(this);

    this.pathTo[helperName].toString = function () {
        return this.pathTo[helperName]();
    }.bind(this);
};

/**
 * Resources mapper
 *
 * @param {String} name
 * @param {Object} params
 * @param {Function|Array} actions
 *
 * Example
 *
 *     map.resources('users');
 *
 */
Resource.prototype.resources = function (name, params, actions) {
    var self = this;
    // params are optional
    params = params || {};

    // if params arg omitted, second arg may be `actions`
    if (typeof params === 'function') {
        actions = params;
        params = {};
    }
    if (!params.middleware) {
        params.middleware = [];
    }
    params.middleware = this.middlewareStack.concat(params.middleware);
    params.appendFormat = ('appendFormat' in params) ? params.appendFormat : true;

    // If resource uses the path param, it's subroutes should be
    // prefixed by path, not the resource's name
    // i.e.:
    // map.resource('users', {path: ':username'}, function(user) {
    //   user.resources('posts);
    // });
    //
    // /:username/posts.:format?
    // /:username/posts/new.:format?
    // etc.
    var prefix = params.path ? params.path : name;

    // we have bunch of actions here, will create routes for them
    var activeRoutes = getActiveRoutes(params);

    // but first, create subroutes
    if (typeof actions === 'function') {
        if (params.singleton) {
            this.subroutes(prefix, actions); // singletons don't need to specify an id
        } else {
            var sname = name.singularize() || name;
            this.subroutes(prefix + '/:' + sname.foreign_key(), actions);
        }
    }
    // now let's walk through action routes
    for (var action in activeRoutes) {
        (function (action) {
            var route = activeRoutes[action].split(/\s+/);
            var method = route[0];
            var path = route[1];

            // append format
            if (params.appendFormat !== false) {
                if (path === '/') {
                    path = '.:format?';
                } else {
                    path += '.:format?';
                }
            }

            // middleware logic (backward compatibility)
            var middlewareExcept = params.middlewareExcept, skipMiddleware = false;
            if (middlewareExcept) {
                if (typeof middlewareExcept === 'string') {
                    middlewareExcept = [middlewareExcept];
                }
                middlewareExcept.forEach(function (a) {
                    if (a === action) {
                        skipMiddleware = true;
                    }
                });
            }
            /*
             switch(action) {
             case 'edit':
             case 'show':
             case 'new':
             case 'destroy':
             name = name.singularize();
             break;
             }
             */
            // params.path setting allows to override common path component
            var effectivePath = (params.path || name) + path;
            var controller = params.controller || name;

            // and call map.{get|post|update|delete}
            // with the path, controller, middleware and options
            this[method.toLowerCase()].call(
                this,
                effectivePath,
                controller + '#' + action,
                skipMiddleware ? [] : params.middleware,
                getParams(action, params)
            );
        }.bind(this))(action);
    }

    // calculate set of routes based on params.only and params.except
    function getActiveRoutes(params) {
        var activeRoutes = {},
            availableRoutes =
            {
                'index': 'GET     /',
                'create': 'POST    /',
                'new': 'GET     /new',
                'edit': 'GET     /:id/edit',
                'destroy': 'DELETE  /:id',
                'update': 'PUT     /:id',
                'show': 'GET     /:id',
                'destroyall': 'DELETE  /'
            },
            availableRoutesSingleton =
            {
                'show': 'GET     /show',
                'create': 'POST    /',
                'new': 'GET     /new',
                'edit': 'GET     /edit',
                'destroy': 'DELETE  /',
                'update': 'PUT     /',
                'destroyall': 'DELETE  /'
            };

        if (params.singleton) {
            availableRoutes = availableRoutesSingleton;
        }

        // 1. only
        if (params.only) {
            if (typeof params.only === 'string') {
                params.only = [params.only];
            }
            params.only.forEach(function (action) {
                if (action in availableRoutes) {
                    activeRoutes[action] = availableRoutes[action];
                }
            });
        }
        // 2. except
        else if (params.except) {
            if (typeof params.except === 'string') {
                params.except = [params.except];
            }
            for (var action in availableRoutes) {
                if (params.except.indexOf(action) === -1) {
                    activeRoutes[action] = availableRoutes[action];
                }
            }
        }
        // 3. all
        else {
            for (var action in availableRoutes) {
                activeRoutes[action] = availableRoutes[action];
            }
        }

        return activeRoutes;
    }

    function getParams(action, params) {
        var p = {};
        var plural = true;// action === 'index' || action === 'create';
        if (params.as) {
            p.as = plural ? params.as : params.as.singularize();
            p.as = self.urlHelperName(self.globPath + p.as);
            if (action === 'new' || action === 'edit') {
                p.as = action + '_' + p.as;
            }
        }

        if (params.path && !p.as) {
            var aname = plural ? name : name.singularize();
            aname = self.urlHelperName(self.globPath + aname);
            p.as = action === 'new' || action === 'edit' ? action + '_' + aname : aname;
        }
        if ('state' in params) {
            p.state = params.state;
        }

        return p;
    }
};

/*
 * Make Resource.
 *
 * @param {String} name
 * @param {Object} params
 * @param {Function} actions
 * @returns {Resource}
 */
Resource.prototype.resource = function (name, params, actions) {
    var self = this;
    // params are optional
    params = params || {};
    // if params arg omitted, second arg may be `actions`
    if (typeof params === 'function') {
        actions = params;
        params = {};
    }
    params.singleton = true;
    return self.resources(name, params, actions);
};

/*
 * Namespaces mapper.
 *
 * @param {String} name
 * @param {Object} options
 * @param {String} subroutes
 *
 * Example:
 *
 *     map.namespace('admin', function (admin) {
 *         admin.resources('user');
 *     });
 *
 */
Resource.prototype.namespace = function (name, options, subroutes) {
    if (typeof options === 'function') {
        subroutes = options;
        options = null;
    }
    if (options && typeof options.middleware === 'function') {
        options.middleware = [options.middleware];
    }

    // store previous ns
    var old_ns = this.ns, oldGlobPath = this.globPath;
    // add new ns to old (ensure tail slash present)
    this.ns = old_ns + name.replace(/\/$/, '') + '/';
    this.globPath = oldGlobPath + name.replace(/\/$/, '') + '/';
    if (options && options.middleware) {
        this.middlewareStack = this.middlewareStack.concat(options.middleware);
    }
    subroutes(this);

    if (options && options.middleware) {
        options.middleware.forEach([].pop.bind(this.middlewareStack));
    }

    this.ns = old_ns;
    this.globPath = oldGlobPath;
};

/*
 * Make subroutes.
 *
 * @param {String} name
 * @param {Function} subroutes
 * @returns {String}
 */
Resource.prototype.subroutes = function (name, subroutes) {
    // store previous ns
    var oldGlobPath = this.globPath;
    // add new ns to old (ensure tail slash present)
    this.globPath = oldGlobPath + name.replace(/\/$/, '') + '/';
    subroutes(this);
    this.globPath = oldGlobPath;
};

/**
 * Load routing map from module at `path`. Module should have `routes` function
 * or export single function:
 *
 * @param {String} path
 * @param {Function} customBridge
 *
 *     module.exports = function (map) {
 *         map.resources('books');
 *     });
 */
Resource.prototype.addRoutes = function (path, customBridge) {
    var map = this;
    var routes = require(path);
    routes = routes.routes || routes;
    if (typeof routes !== 'function') {
        throw new Error('Routes is not defined in ' + path);
    }
    // temporarily change bridge
    if (customBridge) {
        bridge = map.bridge;
        map.bridge = customBridge;
    }
    var r = routes(map);
    if (customBridge) {
        map.bridge = bridge;
    }
    return r;
};