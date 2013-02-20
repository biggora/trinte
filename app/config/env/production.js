/**
 *  PRODUCTION Environment settings
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 *
 *  @param {TrinteJS} app
 *  @param {ExpressJS} express
 **/

module.exports = function(app, express) {
    app.use(express.logger({
        format: ':method :url :status'
    }));
    app.use(express.compress());
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: false
    }));
};
