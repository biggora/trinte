/**
 *  Default session configuration
 *  Inject app and express reference
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

var config = require('./configuration');
var CaminteStore = require('../bin/session');

module.exports = function(app, express) {
    app.configure(function() {
        var sessionStore = CaminteStore(express);
        app.use(express.session({
            cookie: {
                maxAge: config.session.maxAge
            },
            key: config.session.key,
            secret: config.session.secret,
            store: new sessionStore({
                maxAge: config.session.maxAge,
                clear_interval: config.session.clear_interval || 0
            })
        }));
    });
}