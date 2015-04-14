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

module.exports = function (params, router) {
    params.add(router, 'id', /^[A-Za-z0-9]+$/);
    params.add(router, 'controller', /^[a-zA-Z]+$/);
    params.add(router, 'action', /^[a-zA-Z]+$/);
    params.add(router, 'format', /^[a-zA-Z]+$/);
    params.add(router, 'from', /^\d+$/);
    params.add(router, 'to', /^\d+$/);
};