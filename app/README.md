# APPNAME Javascript MVC Application

## Description


## Installation


## Table of contents

var RequestIO, RoomIO, async, connect, express, http, https, initRoutes, io, key, listen, middleware, session, sessionConfig, value, _;
connect = require('express/node_modules/connect');
express = require('express');
io = require('socket.io');
http = require('http');
https = require('https');
async = require('async');
middleware = require('./middleware');
_ = require('underscore');
RequestIO = require('./request').RequestIO;
RoomIO = require('./room').RoomIO;
express.io = io;
express.io.routeForward = middleware.routeForward;
session = express.session;
delete express.session;
sessionConfig = new Object;

express.session = function(options) {
 if (options == null) {
    options = new Object;
  }
  if (options.key == null) {
    options.key = 'connect.sid';
  }
  if (options.store == null) {
    options.store = new session.MemoryStore;
  }
  if (options.cookie == null) {
    options.cookie = new Object;
  }
  sessionConfig = options;
  return session(options);
};

for (key in session) {
  value = session[key];
  express.session[key] = value;
}

express.application.http = function() {
  this.server = http.createServer(this);
  return this;
};

express.application.https = function(options) {
  this.server = https.createServer(options, this);
  return this;
};

express.application.io = function(options) {
  var defaultOptions,
    _this = this;
  if (options == null) {
    options = new Object;
  }
  defaultOptions = {
    log: false
  };
  _.extend(options, defaultOptions);
  this.io = io.listen(this.server, options);
  this.io.router = new Object;
  this.io.middleware = [];
  this.io.route = function(route, next, options) {
    var split, _results;
    if ((options != null ? options.trigger : void 0) === true) {
      if (route.indexOf(':' === -1)) {
        this.router[route](next);
      } else {
        split = route.split(':');
        this.router[split[0]][split[1]](next);
      }
    }
    if (_.isFunction(next)) {
      return this.router[route] = next;
    } else {
      _results = [];
      for (key in next) {
        value = next[key];
        _results.push(this.router["" + route + ":" + key] = value);
      }
      return _results;
    }
  };
  this.io.configure(function() {
    return _this.io.set('authorization', function(data, next) {
      var cookieParser;
      if (sessionConfig.store == null) {
        return async.forEachSeries(_this.io.middleware, function(callback, next) {
          return callback(data, next);
        }, function(error) {
          if (error != null) {
            return next(error);
          }
          return next(null, true);
        });
      }
      cookieParser = express.cookieParser();
      return cookieParser(data, null, function(error) {
        var rawCookie, request, sessionId;
        if (error != null) {
          return next(error);
        }
        rawCookie = data.cookies[sessionConfig.key];
        if (rawCookie == null) {
          request = {
            headers: {
              cookie: data.query.cookie
            }
          };
          return cookieParser(request, null, function(error) {
            var sessionId;
            data.cookies = request.cookies;
            rawCookie = data.cookies[sessionConfig.key];
            if (rawCookie == null) {
              return next("No cookie present", false);
            }
            sessionId = connect.utils.parseSignedCookie(rawCookie, sessionConfig.secret);
            data.sessionID = sessionId;
            return sessionConfig.store.get(sessionId, function(error, session) {
              if (error != null) {
                return next(error);
              }
              data.session = new connect.session.Session(data, session);
              return next(null, true);
            });
          });
        }
        sessionId = connect.utils.parseSignedCookie(rawCookie, sessionConfig.secret);
        data.sessionID = sessionId;
        return sessionConfig.store.get(sessionId, function(error, session) {
          if (error != null) {
            return next(error);
          }
          data.session = new connect.session.Session(data, session);
          return next(null, true);
        });
      });
    });
  });
  this.io.use = function(callback) {
    return _this.io.middleware.push(callback);
  };
  this.io.sockets.on('connection', function(socket) {
    return initRoutes(socket, _this.io);
  });
  this.io.broadcast = function() {
    var args;
    args = Array.prototype.slice.call(arguments, 0);
    return _this.io.sockets.emit.apply(_this.io.sockets, args);
  };
  this.io.room = function(room) {
    return new RoomIO(room, _this.io.sockets);
  };
  this.stack.push({
    route: '',
    handle: function(request, response, next) {
      request.io = {
        route: function(route) {
          var ioRequest;
          ioRequest = new Object;
          for (key in request) {
            value = request[key];
            ioRequest[key] = value;
          }
          ioRequest.io = {
            broadcast: _this.io.broadcast,
            respond: function() {
              var args;
              args = Array.prototype.slice.call(arguments, 0);
              return response.json.apply(response, args);
            },
            route: function(route) {
              return _this.io.route(route, ioRequest, {
                trigger: true
              });
            },
            data: request.body
          };
          return _this.io.route(route, ioRequest, {
            trigger: true
          });
        },
        broadcast: _this.io.broadcast
      };
      return next();
    }
  });
  return this;
};

listen = express.application.listen;

express.application.listen = function() {
  var args;
  args = Array.prototype.slice.call(arguments, 0);
  if (this.server != null) {
    return this.server.listen.apply(this.server, args);
  } else {
    return listen.apply(this, args);
  }
};

initRoutes = function(socket, io) {
  var setRoute, _ref, _results;
  setRoute = function(key, callback) {
    return socket.on(key, function(data, respond) {
      var request, _base;
      if (typeof data === 'function') {
        respond = data;
        data = void 0;
      }
      request = {
        data: data,
        session: socket.handshake.session,
        sessionID: socket.handshake.sessionID,
        sessionStore: sessionConfig.store,
        socket: socket,
        headers: socket.handshake.headers,
        cookies: socket.handshake.cookies,
        handshake: socket.handshake
      };
      session = socket.handshake.session;
      if (session != null) {
        request.session = new connect.session.Session(request, session);
      }
      socket.handshake.session = request.session;
      request.io = new RequestIO(socket, request, io);
      request.io.respond = respond;
      if ((_base = request.io).respond == null) {
        _base.respond = function() {};
      }
      return callback(request);
    });
  };
  _ref = io.router;
  _results = [];
  for (key in _ref) {
    value = _ref[key];
    _results.push(setRoute(key, value));
  }
  return _results;
};

module.exports = express;