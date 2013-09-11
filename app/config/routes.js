/**
 *  Routes manager
 *  Inject resource mapper reference
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

module.exports = function routes(map) {
       map.root("apps#index");
       map.all("/login","apps#login");
};