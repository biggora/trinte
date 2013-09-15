/**
 *  Session schema
 *
 *  @package     TrinteJS
 *  @version     0.0.1
 *  @desc        Web-based Application
 *  @author      Aleks
 *  @created     2013-09-11T09:31:53.033Z
 *
 *  Created by create-model script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

/**
 *  Define Session Model
 *  @param {Object} schema
 **/
module.exports = function(schema) {
    var Session = schema.define('session', {
        sid: {type: String, index: true, unique: true},
        session_data: { type: schema.JSON },
        expires: {type: Date, index: true},
        expireAfterSeconds: {type: Number, index: true},
        ip: {type: String, 'default': 'localhost'},
        logedIn: {type: Number, index: true, 'default': 0},
        user: {type: String, index: true, 'default': 'Guest'}
    });
    return Session;
};