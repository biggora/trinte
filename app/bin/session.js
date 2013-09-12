/**
 *  Caminte sessions
 *
 *  Created by init script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

/**
 * Library version.
 **/

exports.version = '0.0.1';

/**
 * CaminteStore
 *
 * @param {Object} connect
 * @api public
 */
module.exports = function(connect) {
    var Store = connect.session.Store;

    /**
     * Initialize CaminteStore with the given `options`.
     * Calls `callback` when db connection is ready (mainly for testing purposes).
     *
     * @param {Object} options
     * @param {Function} callback
     * @api public
     **/
    function CaminteStore(options, callback) {
        var self = this;
        self.options = options || {};
        Store.call(self, options);

        if (options.clear_interval > 0) {
            self.clear_interval = setInterval(function() {
                Session.remove({
                    Where: {
                        expires: {
                            lt: new Date()
                        }
                    }
                }, function(err) {
                    if (err) {
                        console.log('Clear sessions: ', err);
                    }
                });
            }, options.clear_interval * 1000, self);
        }
        callback && callback(Session);
    }
    /**
     * Inherit from `Store`.
     */

    CaminteStore.prototype.__proto__ = Store.prototype;
    /**
     * Attempt to fetch session by the given `sid`.
     *
     * @param {String} sid
     * @param {Function} callback
     * @api public
     */
    CaminteStore.prototype.get = function(sid, callback) {
        var self = this;
        Session.findOne({
            sid: sid,
            expires: {
                gt: new Date()
            }
        }).exec(function(err, founded_session) {
            if (founded_session && founded_session.session_data) {
                var sess = JSON.parse(founded_session.session_data);
                callback && callback(err, sess);
            } else {
                callback && callback(err);
            }
        });
    };
    /**
     * Commit the given `sess` object associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Session} session
     * @param {Function} callback
     * @api public
     */
    CaminteStore.prototype.set = function(sid, session, callback) {
        var self = this;
        try {
            var new_session = {sid: sid, session_data: session};
            if (session && session.cookie) {
                if (session.cookie._expires) {
                    new_session.expires = new Date(session.cookie._expires);
                } else {
                    var today = new Date(),
                            sessLifeTime = self.options.maxAge || (1000 * 60 * 60 * 24 * 14);
                    new_session.expires = new Date(today.getTime() + sessLifeTime);
                }
            }

            Session.updateOrCreate({
                sid: sid
            }, new_session, function(err, csession) {
                if (err) {
                    callback && callback(err);
                } else {
                    callback && callback(null, csession);
                }
            });
        } catch (err) {
            callback && callback(err);
        }
    };

    /**
     * Destroy the session associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Function} callback
     * @api public
     */
    CaminteStore.prototype.destroy = function(sid, callback) {
        Session.findOne({
            sid: sid
        }).exec(function(err, data) {
            if (err) {
                callback && callback(err);
            } else if (data) {
                data.destroy(function(err) {
                    callback && callback(null, data);
                });
            } else {
                callback && callback(err);
            }
        });
    };

    /**
     * Fetch number of sessions.
     *
     * @param {Function} callback
     * @api public
     */
    CaminteStore.prototype.length = function(callback) {
        Session.count({}, function(err, count) {
            if (err) {
                callback && callback(err);
            } else {
                callback && callback(null, count);
            }
        });
    };

    /**
     * Clear all sessions.
     *
     * @param {Function} callback
     * @api public
     */
    CaminteStore.prototype.clear = function(callback) {
        Session.destroyAll(function() {
            callback && callback();
        });
    };

    /**
     * Select all sessions.
     *
     * @param {Function} callback
     * @api public
     */
    CaminteStore.prototype.all = function(callback) {
        var self = this;
        Session.all({}, function(err, sessions) {
            if (err) {
                callback && callback(err);
            } else {
                callback && callback(null, sessions);
            }
        });
    };

    return CaminteStore;
};