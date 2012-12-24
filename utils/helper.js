/**
 * Module dependencies.
 */

exports.init = function () {
    return function (req, res, next) {
        var session = req.session;
        res.locals = {
            session : session,
            request : req,
            formVal : function (val) {
                return typeof val == 'undefined' ? "" : val;
            },
            sortFor : function (field, title, tooltip) {
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
                return '<a ' + dt + ' class="sorter ' + icon + '" data-field="' + field + '" data-direction="' + dd + '" href="?' + uri.join('&') + '">' + title + '</a>';
            }
        };

        next();
    }
}