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
var morgan = require('morgan');
var errorHandler = require('errorhandler');

module.exports = function(app,express) {
    app.set('trust proxy', true);
    app.set('json spaces', 2);
    app.set('view cache', false);
    app.use(morgan('dev')); 
    app.set('jsonp callback name', 'callback');
    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
};