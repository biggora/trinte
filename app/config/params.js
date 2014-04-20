/**
 *  Default params manager
 *  Inject app and express reference
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 *
 *  @param {TrinteJS} app
 **/

module.exports = function (app) {
    app.param('id', /^[A-Za-z0-9]+$/);
    app.param('controller', /^[a-zA-Z]+$/);
    app.param('action', /^[a-zA-Z]+$/);
    app.param('format', /^[a-zA-Z]+$/);
    app.param('from', /^\d+$/);
    app.param('to', /^\d+$/);
};