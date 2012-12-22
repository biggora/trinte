/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

exports.init = function () {
    return function (req, res, next) {
        var session = req.session;
        res.locals.session = session;
        res.locals.request = req;
        res.locals.formVal = function (val) {
            return typeof val == 'undefined' ? "" : val;
        };
        res.locals.hasMessages = Object.keys(req.session.messages || {}).length,
            res.locals.messages = function messages() {
                var msgs = session.messages;
                return Object.keys(msgs).reduce(function (arr, type) {
                    return arr.concat(msgs[type]);
                }, []);
            };
        req.flash = function (type, msg) {
            if (this.session === undefined) throw Error('req.flash() requires sessions');
            if (!msg) {
                msg = type;
                type = "info";
            }
            if (type && msg) {
                this.session.messages = [
                    {
                        type: type,
                        message: msg
                    }
                ];
            } else {
                var message = this.session.messages;
                delete this.session.messages;
                return message;
            }
        };
        res.locals.sortFor = function (field, title, tooltip) {
            var direction = '-', query = req.query,
                sort = false, uri = [], icon = "", dd, dt = "";
            for (var q in query) {
                if (q == 'sort') {
                    sort = true;
                    direction = /^-/.test(query.sort) ? "" : "-";
                    uri.push(q + '=' + direction + field);
                    if(eval('/' + field + '/gi').test(query.sort)) {
                        icon = direction == '-' ? "headerSortDown" : "headerSortUp";
                    }
                } else {
                    uri.push(q + '=' + query[q]);
                }
            }
            if(!sort) {
                uri.push('sort=' + direction + field);
            }
            dd = direction == '-' ? "DESC" : "ASC";
            dt = tooltip ? 'rel="tooltip" data-title="' + tooltip + '"' : "";
            return '<a ' + tooltip + ' class="sorter ' + icon + '" data-field="' + field + '" data-direction="' + dd + '" href="?' + uri.join('&') + '">' + title + '</a>';
        }
        next();
    }
}