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

module.exports = function(app, express) {

    // DEVELOPMENT
    app.configure('development', function() {
        require("./env/development.js")(app, express);
    });

    // TEST
    app.configure('test', function() {
        require("./env/test.js")(app, express);
    });

    // PRODUCTION
    app.configure('production', function() {
        require("./env/production.js")(app, express);
    });

};
