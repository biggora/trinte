/**
 *  TEST Environment settings
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 *
 *  @param {TrinteJS} app
 *  @param {ExpressJS} express
 **/

module.exports = function(app,express) {
    app.set('trust proxy', true);
    app.set('json spaces', 0);
    app.set('view cache', true);
    app.use(express.logger({
        format: ':method :url :status'
    }));
    app.set('jsonp callback name', 'callback');
    app.use(express.compress());
    app.use(express.errorHandler({
        dumpExceptions: false,
        showStack: false
    }));
};
