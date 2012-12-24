
/**
 * TEST Environment settings
 */
module.exports = function(app,express) {
    app.use(express.logger({
        format: ':method :url :status'
    }));
    app.use(express.compress());
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: false
    }));

}
