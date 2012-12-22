
/**
 * PRODUCTION Environment settings
 */
module.exports = function(app,express) {
    app.set('db-uri', 'mongodb://localhost/trinte-production');
    app.use(express.logger({
        format: ':method :url :status'
    }));
    app.use(express.compress());
    app.use(express.errorHandler({
        dumpExceptions: false,
        showStack: false
    }));

}
