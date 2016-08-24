/*
 * NeetJS
 * http://neetjs.org
 *
 * Copyright neetjs.org
 * Released under the MIT license
 * https://github.com/neetjs/NeetJS/blob/master/LICENSE
 *
 */
var neetjs = new (function () {
    var _mods = {};
    // 'this' is dom object
    var _render = function ($this, $scope) {
        if (!$.isPlainObject($scope)) {
            console.log('NeetJS: Error: scope data should be plain object');
        }
        // import scope variables
        for (var _key in $scope) {
            eval('var '+_key+' = $scope[_key]');
        }
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
                    _render(clone, $scope);
                    $($this).before(clone);
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
                ctx['dest'] = this;
                neetjs.render(ctx);
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
                if (!$(this).parent().find(this).length) {
                    // if this dom object is removed during eval, break
                    return;
                }
            }
        });
        $($this).children().each(function () {
            _render(this, $scope);
        });
    };

    this.loadmod = function (name, content) {
        if (name === undefined && content === undefined) {
            // if no arguments given, load from document
            $('[nt-mod]').each(function () {
                var name = $(this).attr('nt-mod');
                $(this).removeAttr('nt-mod');
                neetjs.loadmod(name, this);
                $(this).replaceWith();
            });
            return;
        }
        if (_mods[name] !== undefined) {
            console.log('NeetJS: Warn: redundant loadmod call for mod ' + name + ', ignored.');
            return;
        }
        var spacejq = $(document.createElement('body'));
        spacejq.append(content);
        if (spacejq.children().length !== 1) {
            console.log('NeetJS: Error: mod ' + name + ' should have a root element.');
        }
        var dom = spacejq.children()[0];
        _mods[name] = dom;
        $(dom).find('style').appendTo('head');
    };

    this.render = function (context) {
        var mod = context.mod;
        var selector = context.dest;
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
            }
            $(selector).replaceWith(this);
        });
    };

    // load mods from page when body is ready
    $(function () {
        neetjs.loadmod();
    });

})();
