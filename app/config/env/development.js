/**
 *  DEVELOPMENT Environment settings
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
    app.set('json spaces', 2);
    app.set('view cache', false);
    app.use(express.logger("dev"));
    app.set('jsonp callback name', 'callback');
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
};