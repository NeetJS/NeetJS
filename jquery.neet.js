/*
 * NeetJS
 * http://neetjs.org
 *
 * Copyright neetjs.org
 * Released under the MIT license
 * https://github.com/prchen-open/NeetJS/blob/master/LICENSE
 *
 */

(function ($) {
    var _debug_mod = false;
    var _loaders_idx = [];
    var _loaders_name = {};
    var _mods = {};

    var setDebugMode = function (enable) {
        enable = enable ? true : false;
        _debug_mod = enable;
    };

    var log = new (function () {
        // ignore output for browsers which not support console
        var console = window.console;
        if (console === undefined) {
            console = {
                log: $.noop,
                error: $.noop,
                warn: $.noop,
                info: $.noop,
                debug: $.noop,
                trace: $.noop
            };
        }
        this.error = function (msg) {
            console.error('NeetJS ERROR - ' + msg);
            if (_debug_mod) {
                console.trace('Debug stack trace...');
            }
        };
        this.warn = function (msg) {
            console.warn('NeetJS WARN - ' + msg);
            if (_debug_mod) {
                console.trace('Debug stack trace...');
            }
        };
        this.info = function (msg) {
            console.info('NeetJS INFO - ' + msg);
            if (_debug_mod) {
                console.trace('Debug stack trace...');
            }
        };
        this.debug = function (msg) {
            console.debug('NeetJS DEBUG - ' + msg);
            if (_debug_mod) {
                console.trace('Debug stack trace...');
            }
        };
    })();

    var addModLoader = function (obj) {
        var name = obj.name;
        var loader = obj.loader;
        if (name === undefined) {
            log.error('Mod loader should match the pattern of {name: \'loaderName\', loader: function (mod) {...} }.');
            return;
        }
        if (loader === undefined || !$.isFunction(loader)) {
            log.error('Mod loader should match the pattern of {name: \'loaderName\', loader: function (mod) {...} }.');
            return;
        }
        if (_loaders_name[name] !== undefined) {
            log.warn('redundant mod loader added named ' + name + ', override.');
        }
        _loaders_idx.push(loader);
        _loaders_name[name] = loader;
    };

    var _getMod = function (mod_name) {
        if (_mods[mod_name] !== undefined) {
            return _mods[mod_name];
        }
        for (var idx in _loaders_idx) {
            var loader = _loaders_idx[idx];
            loader(mod_name);
            if (_mods[mod_name] !== undefined) {
                return _mods[mod_name];
            }
        }
        throw 'Cannot load mod \'' + mod_name + '\'.';
    };

    var loadFromContent = function (content) {
        if (content === undefined) {
            return;
        }
        var spacejq = $(document.createElement('body'));
        spacejq.append(content);
        $(spacejq).find('[nt-mod]').each(function () {
            var name = $(this).attr('nt-mod');
            if (_mods[name] !== undefined) {
                log.warn('redundant loadmod call for mod ' + name + ', ignore.');
                return;
            }
            $(this).removeAttr('nt-mod');
            $(this).find('[nt-head]').each(function () {
                $(this).removeAttr('nt-head');
                var rid = $(this).attr('nt-resource-id');
                if (rid && $('head [nt-resource-id=' + rid + ']').length > 0) {
                    $(this).appendTo();
                    return;
                }
                $(this).appendTo('head');
            });
            _mods[name] = this;
        });
    };

    var loadFromRemote = function (opt) {
        var callback = opt.success;
        opt.success = function (content) {
            loadFromContent(content);
            if ($.isFunction(callback)) {
                callback(content);
            }
        };
        $.ajax(opt);
    };

    var loadFromBody = function () {
        $('body [nt-mod]').each(function () {
            loadFromContent(this);
            $(this).replaceWith();
        });
    };

    // private recursive render function
    var _render = function ($this, $scope) {
        if (!$.isPlainObject($scope)) {
            log.error('scope data should be plain object');
        }
        // import scope variables
        for (var _key in $scope) {
            eval('var '+_key+' = $scope[_key]');
        }
        var _parent = $($this).parent();
        $($this).each(function () {
            //nt-if
            if ($(this).attr('nt-if') !== undefined) {
                if (eval($(this).attr('nt-if'))) {
                    $(this).removeAttr('nt-if');
                } else {
                    $(this).replaceWith();
                    return;
                }
            }
            //nt-repeat
            if ($(this).attr('nt-repeat') !== undefined) {
                var _declare = $(this).attr('nt-repeat'), _dname, _kname, _vname;
                if (/^[a-z]+.* as [a-zA-Z]+[0-9a-zA-Z]*$/.test(_declare)) {
                    var arr = _declare.split(' ', 3);
                    _dname = arr[0];
                    _vname = arr[2];
                } else if (/^[a-z]+.* as [a-zA-Z]+[0-9a-zA-Z]* : [a-zA-Z]+[0-9a-zA-Z]*$/.test(_declare)) {
                    var arr = _declare.split(' ', 5);
                    _dname = arr[0];
                    _kname = arr[2];
                    _vname = arr[4];
                } else {
                    throw 'nt-repeat declaration should match to \'dataset as value\' or \'dataset as key : value\'';
                }
                $(this).removeAttr('nt-repeat');
                var _data = eval(_dname);
                var _for = function ($this, _key) {
                    var clone = $($this).clone()[0];
                    if (_kname !== undefined) {
                        $scope[_kname] = _key;
                    }
                    $scope[_vname] = _data[_key];
                    // insert before render
                    $($this).before(clone);
                    _render(clone, $scope);
                };
                if ($.isArray(_data)) {
                    for (var _key = 0 ; _key < _data.length ; _key++) {
                        _for(this, _key);
                    }
                } else {
                    for (var _key in _data) {
                        _for(this, _key);
                    }
                }
                $(this).replaceWith();
                return;
            }
            //nt-replace
            if ($(this).attr('nt-replace') !== undefined) {
                var ctx = eval('('+$(this).attr('nt-replace')+')');
                $(this).ntReplace(ctx);
                return;
            }
            //nt-inject
            if ($(this).attr('nt-inject') !== undefined) {
                var ctx = eval('('+$(this).attr('nt-inject')+')');
                $(this).ntInject(ctx);
            }
            //nt-prepend
            if ($(this).attr('nt-prepend') !== undefined) {
                var ctx = eval('('+$(this).attr('nt-prepend')+')');
                $(this).ntPrepend(ctx);
            }
            //nt-append
            if ($(this).attr('nt-append') !== undefined) {
                var ctx = eval('('+$(this).attr('nt-append')+')');
                $(this).ntAppend(ctx);
            }
            //nt-before
            if ($(this).attr('nt-before') !== undefined) {
                var ctx = eval('('+$(this).attr('nt-before')+')');
                $(this).ntBefore(ctx);
            }
            //nt-after
            if ($(this).attr('nt-after') !== undefined) {
                var ctx = eval('('+$(this).attr('nt-after')+')');
                $(this).ntAfter(ctx);
            }
            //nt-attr
            if ($(this).attr('nt-attr') !== undefined) {
                eval('$(this).attr('+$(this).attr('nt-attr')+');');
                $(this).removeAttr('nt-attr');
            }
            //nt-html
            if ($(this).attr('nt-html') !== undefined) {
                var html = eval($(this).attr('nt-html'));
                $(this).html(html);
                $(this).removeAttr('nt-html');
            }
            //nt-eval
            if ($(this).attr('nt-eval') !== undefined) {
                eval($(this).attr('nt-eval'));
                $(this).removeAttr('nt-eval');
            }
            //nt-remove
            if ($(this).attr('nt-remove') !== undefined) {
                $(this).replaceWith();
            }
        });
        if (!_parent.find($this).length) {
            return;
        }
        $($this).children().each(function () {
            _render(this, $scope);
        });
    };

    var _nt_render = function (jqobj, opt, method) {
        jqobj.each(function () {
            var mod = _getMod(opt.mod);
            var $scope = opt.data;
            var newdom = $(mod).clone()[0];
            $(document.createElement('html')).append(newdom);
            $(newdom).each(function () {
                _render(this, $scope);
                switch (method){
                    case 'ntReplace':
                        jqobj.replaceWith(this);
                        break;
                    case 'ntInject':
                        jqobj.empty();
                    case 'ntPrepend':
                        jqobj.prepend(this);
                        break;
                    case 'ntAppend':
                        jqobj.append(this);
                        break;
                    case 'ntBefore':
                        jqobj.before(this);
                        break;
                    case 'ntAfter':
                        jqobj.after(this);
                        break;
                    default:
                        throw 'Unexpected case.';
                        break;
                }
            });
        });
    };

    // mount to jQuery
    $.neetjs = {
        setDebugMode:setDebugMode,
        loadFromContent:loadFromContent,
        loadFromRemote:loadFromRemote,
        loadFromBody:loadFromBody
    };

    $.fn.ntReplace = function (opt) {
        _nt_render(this, opt, 'ntReplace');
    };
    $.fn.ntInject = function (opt) {
        _nt_render(this, opt, 'ntInject');
    };
    $.fn.ntPrepend = function (opt) {
        _nt_render(this, opt, 'ntPrepend');
    };
    $.fn.ntAppend = function (opt) {
        _nt_render(this, opt, 'ntAppend');
    };
    $.fn.ntBefore = function (opt) {
        _nt_render(this, opt, 'ntBefore');
    };
    $.fn.ntAfter = function (opt) {
        _nt_render(this, opt, 'ntAfter');
    };

})(jQuery);
