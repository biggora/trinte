/**
 * Module dependencies.
 */

exports.init = function() {
    return function(req, res, next) {
        var session = req.session;
        res.locals({
            controllers: [],
            session: session,
            request: req,
            formVal: function(val) {
                return typeof val === 'undefined' ? "" : val;
            },
            sortFor: function(field, title, tooltip) {
                var direction = '-', query = req.query,
                        sort = false, uri = [], icon = "", dd, dt = "";
                for (var q in query) {
                    if (q === 'sort') {
                        sort = true;
                        direction = /^-/.test(query.sort) ? "" : "-";
                        uri.push(q + '=' + direction + field);
                        if (eval('/' + field + '/gi').test(query.sort)) {
                            icon = direction === '-' ? "headerSortDown" : "headerSortUp";
                        }
                    } else {
                        uri.push(q + '=' + query[q]);
                    }
                }
                if (!sort) {
                    uri.push('sort=' + direction + field);
                }
                dd = direction === '-' ? "DESC" : "ASC";
                dt = tooltip ? 'rel="tooltip" data-title="' + tooltip + '"' : "";
                return '<a ' + dt + ' class="sorter ' + icon + '" data-field="' + field + '" data-direction="' + dd + '" href="?' + uri.join('&') + '">' + title + '</a>';
            },
            get_form: {
                makeName: function(name, resource) {
                    var resourceName = false;
                    if (typeof resource === 'string') {
                        resourceName = resource;
                    } else {
                        resourceName = resource && resource.constructor && resource.constructor.modelName || false;
                    }
                    return resourceName ? (resourceName.toLowerCase() + '[' + name + ']') : name;
                },
                makeId: function(name, resource) {
                    var resourceName = false;
                    if (typeof resource === 'string') {
                        resourceName = resource;
                    } else {
                        resourceName = resource && resource.constructor && resource.constructor.modelName || false;
                    }
                    return resourceName ? (resourceName.toLowerCase() + '_' + name) : name;
                },
                input_tag: function(params, override) {
                    return '<input' + html_tag_params(params, override) + ' />';
                },
                label_tag: function(text, params, override) {
                    return generic_tag('label', text, params, override);
                },
                get_value: function(name, params, resource) {
                    params = params || {};
                    if (typeof params.value === 'undefined') {
                        if (typeof resource === 'undefined' || typeof resource === 'string') {
                            params.value = '';
                        } else {
                            var obj = {};
                            try {
                                obj = resource.toJSON();
                            } catch (err) {
                            }
                            params.value = typeof obj[name] !== 'undefined' ? obj[name] : '';
                        }
                    }
                    return params;
                },
                input: function(name, params, resource) {
                    params = params || {};
                    params = get_form.get_value(name, params, resource);
                    return get_form.input_tag({
                        name: get_form.makeName(name, resource),
                        id: get_form.makeId(name, resource)
                    }, params);
                },
                checkbox: function(name, params, resource) {
                    params = params || {};
                    params = get_form.get_value(name, params, resource);
                    if (params.value !== '' && parseInt(params.value) !== 0) {
                        params.checked = 'checked';
                    }
                    return get_form.input_tag({
                        name: get_form.makeName(name, resource),
                        id: get_form.makeId(name, resource),
                        value: 1,
                        type: 'checkbox'
                    }, params);
                },
                file: function(name, params, resource) {
                    params = params || {};
                    params = get_form.get_value(name, params, resource);
                    return get_form.input_tag({
                        name: get_form.makeName(name, resource),
                        id: get_form.makeId(name, resource),
                        type: 'file'
                    }, params);
                },
                label: function(name, caption, params, resource) {
                    return get_form.label_tag(
                            caption || name,
                            {for : get_form.makeId(name, resource)},
                    params);
                },
                submit: function(name, params) {
                    return generic_tag('button', name || 'Commit', {type: 'submit'}, params);
                },
                textarea: function(name, params, resource) {
                    params = params || {};
                    params = get_form.get_value(name, params, resource);
                    return generic_tag('textarea', params.value, {name: get_form.makeName(name, resource), id: get_form.makeId(name, resource)}, params);
                },
                select: function(name, list, current, params, resource) {
                    var __selectTags = '';
                    // Only do something when there is value in the f_list.
                    // Setup the opening tag for select.
                    if (list.length > 0) {
                        list.forEach(function(list_entry) {
                            var item = typeof list_entry === 'string' ? {name: list_entry, value: list_entry} : list_entry;
                            // Setup the option tag with selected = specified.
                            __selectTags = __selectTags + '<option value = "' + item['value'] + '" ';
                            if ((current !== null) && (current === item['value'])) {
                                __selectTags = __selectTags + 'selected = "selected"';
                            }
                            // close the bracket.
                            __selectTags = __selectTags + '> ' + item['name'] + ' </option>';
                        }); // End of forEach loop.
                    }  // end of if f_list.length > 1 check.
                    // close out the select tag
                    return generic_tag('select', __selectTags, {name: get_form.makeName(name, resource), id: get_form.makeId(name, resource)}, params);
                }
            },
            generic_tag: function(name, inner, params, override) {
                return '<' + name + html_tag_params(params, override) + '>' + inner + '</' + name + '>';
            },
            html_tag_params: function(params, override) {
                var maybe_params = '';
                safe_merge(params, override);
                for (var key in params) {
                    if (params[key] && params[key] !== 'undefined') {
                        maybe_params += ' ' + key + '="' + params[key].toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
                    }
                }
                return maybe_params;
            },
            safe_merge: function(merge_what) {
                merge_what = merge_what || {};
                Array.prototype.slice.call(arguments).forEach(function(merge_with, i) {
                    if (i === 0)
                        return;
                    for (var key in merge_with) {
                        if (!merge_with.hasOwnProperty(key) || key in merge_what)
                            continue;
                        merge_what[key] = merge_with[key];
                    }
                });
                return merge_what;
            },
            get_site_param: function(name, params, defval) {
                var cur = '';
                params.forEach(function(param) {
                    if (name === param.name) {
                        cur = param.curvalue;
                    }
                });
                return cur || defval || '';
            },
            loggerDate: function(date) {
                var now = new Date().toISOString();
                if (date) {
                    var time = Date.parse(date);
                    now = new Date(time).toISOString();
                }
                var iso = now.split('T');
                return iso[0].replace('-', '_');
            },
            get_current_date: function(date) {
                var now = new Date().toISOString();
                if (date) {
                    var time = date;
                    if (isNumeric(date)) {
                        time = parseFloat(date);
                    } else if (isNaN(date)) {
                        time = new Date();
                    } else if (typeof date !== 'number') {
                        time = Date.parse(date);
                    }
                    now = new Date(time).toISOString();
                }
                var iso = now.replace('T', ' ').split('.');
                return iso[0];
            }
        });
        next();
    };
};