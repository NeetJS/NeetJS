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
    // ignore output for browsers which not support console
    var console = window.console;
    if (console === undefined) {
        console = {};
        console.log = function () {};
    }

    // loaded modules
    var _debug_mod = false;
    var _mods = {};

    var setDebug = function (enable) {
        enable = enable ? true : false;
        _debug_mod = enable;
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
                console.log('NeetJS: Warn: redundant loadmod call for mod ' + name + ', ignored.');
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
            console.log('NeetJS: Error: scope data should be plain object');
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
                    console.log("NeetJS: Error: repeat declaration should match to 'dataset as value' or 'dataset as key : value'");
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
            //nt-include
            if ($(this).attr('nt-include') !== undefined) {
                var ctx = eval('('+$(this).attr('nt-include')+')');
                $(this).ntrender(ctx);
                return;
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

    var ntrender = function (opt) {
        this.each(function () {
            var context = opt;
            var mod = context.mod;
            var selector = this;
            var $scope = context.data;
            if (_mods[mod] === undefined) {
                console.log('NeetJS: Error: mod ' + mod + ' not found.');
            }
            var newdom = $(_mods[mod]).clone()[0];
            $(document.createElement('html')).append(newdom);
            $(newdom).each(function () {
                try {
                    _render(this, $scope);
                } catch (e) {
                    console.log('NeetJS: Error: ' + e);
                    throw e;
                }
                $(selector).replaceWith(this);
            });
        });
    };

    // mount to jQuery
    $.neetjs = {
        setDebug:setDebug,
        loadFromContent:loadFromContent,
        loadFromRemote:loadFromRemote,
        loadFromBody:loadFromBody
    };
    $.fn.ntrender = ntrender;

})(jQuery);
