
var Application = Application || {};

/**
 * Application class.
 * @constructor
 */
Application.Core = function() {
    this.pathname = window.location.pathname;
    this.origin = window.location.origin;
    this.csrf_token = $('meta[name=csrf-token]').attr('content');
    this.csrf_param = $('meta[name=csrf-param]').attr('content');
    return this;
};

/*
 * Build modal window
 */
Application.Core.prototype.buildModal = function(el, opts) {
    var app = this, title = "", body = "", btnText = "", template = "";
    var modal = $('#dialog-confirm');
    if (opts) {
        if (opts.action) {
            var templates = $('#modal-templates'), template;
            switch (opts.action) {
                case 'delete':
                    template = templates.find('.modal-delete');
                    break;
                case 'save':
                    template = templates.find('.modal-save');
                    break;
            }
            var uri = el.attr('href');
            var pathC = uri.split('/') || [];
            var model = pathC[pathC.length - 2] || '';
            var id = pathC[pathC.length - 1] || '';
            title = template.find('.header-text').html()
                    .replace(/%s/gi, model)
                    .replace(/%d/gi, id);
            body = template.find('.body-text').html()
                    .replace(/%s/gi, model)
                    .replace(/%d/gi, id);
            btnText = template.find('.btn-text').html()
                    .replace(/%s/gi, model)
                    .replace(/%d/gi, id);
        } else {
            title = opts.title || "";
            body = opts.body || "";
            btnText = opts.btnText || "";
        }
    }

    modal.attr('title', title);
    modal.find('#dialog-confirm-header').html(title);
    modal.find('.modal-body').html(body);
    modal.find('.btn-confirm-ok').click(function(e) {
        app.callRemote(el);
    }).html(btnText);
    modal.on('hidden', function() {
        modal.find('.btn-confirm-ok').unbind('click');
    });
    modal.modal('hide');
    modal.modal('show');
};

/**
 * Handles execution of remote calls firing overridable events along the way
 * @param {Object} el
 */
Application.Core.prototype.callRemote = function(el) {
    var app = this,
            method = el.attr('method') || el.attr('data-method') || 'GET',
            url = el.attr('action') || el.attr('href'),
            dataType = el.attr('data-type') || 'script';

    if (el.attr('data-jsonp')) {
        dataType = 'text';
    }

    if (url === undefined) {
        throw "No URL specified for remote call (action or href must be present).";
    } else {
        if (el.triggerAndReturn('ajax:before')) {
            var data = el.is('form') ? el.serializeArray() : [];
            var found = false;
            for (var i = data.length - 1; i >= 0; i -= 1) {
                if (data[i].name === app.csrf_param)
                    found = true;
            }
            if (!found)
                data.push({
                    name: app.csrf_param,
                    value: app.csrf_token
                });
            $.ajax({
                url: url,
                data: data,
                dataType: dataType,
                type: method.toUpperCase(),
                beforeSend: function(xhr) {
                    el.trigger('ajax:loading', xhr);
                },
                success: function(data, status, xhr) {
                    if (el.attr('data-jsonp')) {
                        eval(el.attr('data-jsonp') + '(' + data + ')');
                    }
                    el.trigger('ajax:success', [data, status, xhr]);
                },
                complete: function(xhr) {
                    el.trigger('ajax:complete', xhr);
                },
                error: function(xhr, status, error) {
                    el.trigger('ajax:failure', [xhr, status, error]);
                }
            });
        }
        el.trigger('ajax:after');
    }
};

/**
 * Starts the rails.
 */
Application.Core.prototype.jsonp = function() {
    var app = this;
    $('a[data-remote]').bind('click', function(e) {
        var el = $(this);
        e.preventDefault();
        if (el.attr('data-confirm')) {
            app.buildModal(el, {
                action: "delete"
            });
        } else {
            app.callRemote(el);
        }
    });
};

/**
 * Starts the menu active.
 */
Application.Core.prototype.menuActivator = function() {
    var app = this, url = app.pathname,
            urlRegExp = new RegExp(url === '/' ? app.origin + '/?$' : url.replace(/\/$/, ''));
    $('.navbar-inner ul.nav li a').each(function(i) {
        var self = $(this);
        if (urlRegExp.test(self.attr('href').replace(/\/$/, ''))) {
            self.parent().addClass('active');
        }
    });
};

/**
 * Starts the typeahead.
 */
Application.Core.prototype.typeahead = function() {
    var app = this;
    var tphInput = $('input[data-provide="typeahead"]');

    if (tphInput.length) {
        var dataUrl = tphInput.data('url');
        var dataField = tphInput.data('field');
        var singularUrl = tphInput.data('singular').replace('new', '');

        tphInput.typeahead({
            onSelect: function(item) {
                window.location = singularUrl + '/' + item.value;
            },
            ajax: {
                url: dataUrl + '.json',
                method: "GET",
                timeout: 300,
                displayField: dataField,
                triggerLength: 1,
                loadingClass: 'ajax-loading',
                preDispatch: function(query) {
                    return {
                        search: query
                    };
                },
                preProcess: function(data) {
                    if (data.success === false) {
                        return false;
                    }
                    setTimeout(function() {
                        $('ul.typeahead').css({
                            width: parseInt(tphInput.width()) * 1.06
                        });
                    }, 5);
                    return data || [];
                }
            }
        });
    }
};

/**
 * Starts the Application.
 */
Application.Core.prototype.start = function() {
    var app = this;
    app.menuActivator();
    app.jsonp();
    app.typeahead();
    return app;
};

$(function() {
    $.fn.extend({
        triggerAndReturn: function(name, data) {
            var event = new $.Event(name);
            this.trigger(event, data);

            return event.result !== false;
        }
    });
    var App = new Application.Core().start();
    window.App = App;
});