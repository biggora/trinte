/**
 * DEVELOPMENT Environment settings
 */
module.exports = function(app,express) {
    app.set('db-uri', 'mongodb://localhost/trinte-development');
    app.use(express.logger("dev"));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
}
