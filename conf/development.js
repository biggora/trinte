/**
 * DEVELOPMENT Environment settings
 */

/**
 * @param {Object} app
 * @param {Object} express
 */
module.exports = function(app,express) {
    app.use(express.logger("dev"));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
}
