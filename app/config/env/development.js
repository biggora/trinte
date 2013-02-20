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
    app.use(express.logger("dev"));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
};
