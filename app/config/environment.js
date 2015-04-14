/**
 *  Default configuration manager
 *  Inject app and express reference
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 *
 *  @param {TrinteJS} app
 *  @param {ExpressJS} express
 **/

module.exports = function (app, express) {
    var env = process.env.NODE_ENV || 'development';
    // DEVELOPMENT
    if ('development' === env) {
        require("./env/development.js")(app, express);
    }

    // TEST
    if ('test' === env) {
        require("./env/test.js")(app, express);
    }

    // PRODUCTION
    if ('production' === env) {
        require("./env/production.js")(app, express);
    }
};
