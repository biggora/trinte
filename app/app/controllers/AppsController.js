var fs = require('fs');

module.exports = {
    /**
     * Default Application index - shows a list of the controllers.
     * Redirect here if you prefer another controller to be your index.
     * @param req
     * @param res
     * @param next
     */
    'index': function(req, res, next) {

        /**
         * If you want to redirect to another controller, uncomment
         */

        var controllers = [];

        fs.readdir(__dirname + '/', function(err, files) {

            if (err)
                throw err;

            files.forEach(function(file) {
                if(/\.js$/i.test(file)) {
                   if (file !== "AppsController.js") {
                       controllers.push(file.replace('Controller.js', '').toLowerCase());
                   }
                }
            });

            res.render('app', {
                controllers: controllers
            });

        });
    },
    /**
     * Default Application login page.
     * @param req
     * @param res
     * @param next
     */
    'login': function(req, res, next) {
            res.render('login', {
                controllers: []
            });
    }
};