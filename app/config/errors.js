/**
 *  Default errors pages manager
 *  Inject app reference
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 *
 *  @param {TrinteJS} app
 **/

module.exports = function(app) {
    
    // Example 500 page
    app.use(function(err, req, res, next) {
        console.log('Internal Server Error: ' + err.message);
        res.status(err.status || 500);
        if (parseInt(err.status) === 403) {
            res.render('errors/403', {
                request: req,
                session: req.session
            });
        } else if (parseInt(err.status) === 401) {
            res.render('errors/401', {
                request: req,
                session: req.session
            });
        } else {
            res.render('errors/500', {
                error: err,
                request: req,
                session: req.session
            });
        }
    });

    // Example 404 page via simple Connect middleware
    app.use(function(req, res) {
        res.render('errors/404', {
            request: req,
            session: req.session
        });
    });
};