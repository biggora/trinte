/**
 *  Default middleware manager
 *  Inject app and express reference
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

var useragent = require('express-useragent');

module.exports = function (app, express) {
    app.configure(function () {
        app.use(useragent.express());
    });
};