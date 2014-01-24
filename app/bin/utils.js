
/**
 * Module dependencies.
 */
var XML = require('./xml');
var mime = require('connect').mime;

/**
 * Make `locals()` bound to the given `obj`.
 *
 * This is used for `app.locals` and `res.locals`.
 *
 * @param {Object} obj
 * @return {Function}
 * @api private
 */

exports.locals = function(obj) {
    obj.viewCallbacks = obj.viewCallbacks || [];

    function locals(obj) {
        for (var key in obj)
            locals[key] = obj[key];
        return obj;
    }
    ;

    return locals;
};

/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

exports.isAbsolute = function(path) {
    if ('/' === path[0])
        return true;
    if (':' === path[1] && '\\' === path[2])
        return true;
};

/**
 * Flatten the given `arr`.
 *
 * @param {Array} arr
 * @param {Array} ret
 * @return {Array}
 * @api private
 */

exports.flatten = function(arr, ret) {
    ret = ret || [],
            len = arr.length;
    for (var i = 0; i < len; ++i) {
        if (Array.isArray(arr[i])) {
            exports.flatten(arr[i], ret);
        } else {
            ret.push(arr[i]);
        }
    }
    return ret;
};

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {String}
 * @api private
 */

exports.normalizeType = function(type) {
    return ~type.indexOf('/') ? type : mime.lookup(type);
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */

exports.normalizeTypes = function(types) {
    var ret = [];

    for (var i = 0; i < types.length; ++i) {
        ret.push(~types[i].indexOf('/')
                ? types[i]
                : mime.lookup(types[i]));
    }

    return ret;
};

/**
 * Return the acceptable type in `types`, if any.
 *
 * @param {Array} types
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.acceptsArray = function(types, str) {
    // accept anything when Accept is not present
    if (!str)
        return types[0];

    // parse
    var accepted = exports.parseAccept(str),
            normalized = exports.normalizeTypes(types),
            len = accepted.length;

    for (var i = 0; i < len; ++i) {
        for (var j = 0, jlen = types.length; j < jlen; ++j) {
            if (exports.accept(normalized[j].split('/'), accepted[i])) {
                return types[j];
            }
        }
    }
};

/**
 * Check if `type(s)` are acceptable based on
 * the given `str`.
 *
 * @param {String|Array} type (s)
 * @param {String} str
 * @return {Boolean|String}
 * @api private
 */

exports.accepts = function(type, str) {
    if ('string' === typeof type)
        type = type.split(/ *, */);
    return exports.acceptsArray(type, str);
};

/**
 * Check if `type` array is acceptable for `other`.
 *
 * @param {Array} type
 * @param {Object} other
 * @return {Boolean}
 * @api private
 */

exports.accept = function(type, other) {
    return (type[0] === other.type || '*' === other.type)
            && (type[1] === other.subtype || '*' === other.subtype);
};

/**
 * Parse accept `str`, returning
 * an array objects containing
 * `.type` and `.subtype` along
 * with the values provided by
 * `parseQuality()`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseAccept = function(str) {
    return exports
            .parseQuality(str)
            .map(function(obj) {
                var parts = obj.value.split('/');
                obj.type = parts[0];
                obj.subtype = parts[1];
                return obj;
            });
};

/**
 * Parse quality `str`, returning an
 * array of objects with `.value` and
 * `.quality`.
 *
 * @param {String} str
 * @return {Integer}
 * @api private
 */

exports.parseQuality = function(str) {
    return str
            .split(/ *, */)
            .map(quality)
            .filter(function(obj) {
                return obj.quality;
            })
            .sort(function(a, b) {
                return b.quality - a.quality;
            });
};

/**
 * Parse quality `str` returning an
 * object with `.value` and `.quality`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function quality(str) {
    var parts = str.split(/ *; */)
            , val = parts[0];

    var q = parts[1]
            ? parseFloat(parts[1].split(/ *= */)[1])
            : 1;

    return {value: val, quality: q};
}

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html) {
    return String(html)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
};

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Boolean} sensitive
 * @param  {Boolean} strict
 * @return {RegExp}
 * @api private
 */

exports.pathRegexp = function(path, keys, sensitive, strict) {
    if (path instanceof RegExp)
        return path;
    if (Array.isArray(path))
        path = '(' + path.join('|') + ')';
    path = path
            .concat(strict ? '' : '/?')
            .replace(/\/\(/g, '(?:/')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star) {
                keys.push({name: key, optional: !!optional});
                slash = slash || '';
                return ''
                        + (optional ? '' : slash)
                        + '(?:'
                        + (optional ? slash : '')
                        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                        + (optional || '')
                        + (star ? '(/*)?' : '');
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
};

/**
 * XMLResponse extend respose type
 *
 * @param  {Object} options
 * @return {Function}
 * @api private
 */

exports.XMLResponse = function(options) {
    return function(req, res, next) {
        res.xml = function(code, data, params) {
            if(typeof code === 'object') {
                params = data;
                data = code;
                code = 200;
            }
            var header = (params || {}).header ? params.header : "application/xml";
            res.setHeader("Content-Type", header);
            res.send(XML(data, {xmlHeader: {standalone: true}}));
        };
        next();
    };
};

/**
 * RSSResponse extend respose type
 *
 * @param  {Object} options
 * @return {Function}
 * @api private
 */

exports.RSSResponse = function(options) {
    return function(req, res, next) {
        res.feed = function(data, params) {
            var header = (params || {}).header ? params.header : "application/rss+xml";
            res.setHeader("Content-Type", header);
            res.send(XML(data, {xmlHeader: {standalone: true}}));
        };
        next();
    };
};

/**
 * ErrorResponse extend respose
 *
 * @return {Function}
 * @api private
 */

exports.ErrorResponse = function() {
    return function(req, res, next) {
        res.message = function(format, type, message, code, status) {
            status = status ? status : 200;
            var OutMessage = {};
            OutMessage[type] = {
                status: status,
                message: message,
                code: code
            };
            res.status(status);
            switch (format.toString()) {
                case 'json':
                    res.json(OutMessage);
                    break;
                case 'xml':
                    res.xml({root: OutMessage});
                    break;
                default:
                    req.flash(type, message);
                    res.render('errors/' + status);
            }
        };
        next();
    };
};

/**
 * fixCSRF extend respose type
 *
 * @return {Function}
 * @api private
 */

exports.fixCSRF = function() {
    return function(req, res, next) {
        res.setHeader('X-Powered-By', 'TrinteJS MVC');
        if (typeof req.csrfToken === "undefined") {
            req.csrfToken = function() {
                return '';
            };
            next();
        } else {
            next();
        }
    };
}; 