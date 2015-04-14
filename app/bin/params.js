/**
 * Library version.
 */

exports.version = '0.0.4';

/**
 * Add all param functions to `router`.
 *
 * @param {express.Router} router
 * @api public
 */
exports.add = function (router, param, regex) {
  return router.param(param
      , function (req, res, next, val) {
        var captures = regex.exec(String(val));
        if (util.isArray(captures)) {
          if (1 === captures.length) {
            captures = captures[0];
          }
          req.params[param] = captures;
          next();
        } else {
          next('route');
        }
      });
};