var global = Function("return this;")();
/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);
// pakmanager:remedial
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  /*jslint onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
    (function () {
        "use strict";
    
        var global = Function('return this')()
          , classes = "Boolean Number String Function Array Date RegExp Object".split(" ")
          , i
          , name
          , class2type = {}
          ;
    
        for (i in classes) {
          if (classes.hasOwnProperty(i)) {
            name = classes[i];
            class2type["[object " + name + "]"] = name.toLowerCase();
          }
        }
    
        function typeOf(obj) {
          return (null === obj || undefined === obj) ? String(obj) : class2type[Object.prototype.toString.call(obj)] || "object";
        }
    
        function isEmpty(o) {
            var i, v;
            if (typeOf(o) === 'object') {
                for (i in o) { // fails jslint
                    v = o[i];
                    if (v !== undefined && typeOf(v) !== 'function') {
                        return false;
                    }
                }
            }
            return true;
        }
    
        if (!String.prototype.entityify) {
            String.prototype.entityify = function () {
                return this.replace(/&/g, "&amp;").replace(/</g,
                    "&lt;").replace(/>/g, "&gt;");
            };
        }
    
        if (!String.prototype.quote) {
            String.prototype.quote = function () {
                var c, i, l = this.length, o = '"';
                for (i = 0; i < l; i += 1) {
                    c = this.charAt(i);
                    if (c >= ' ') {
                        if (c === '\\' || c === '"') {
                            o += '\\';
                        }
                        o += c;
                    } else {
                        switch (c) {
                        case '\b':
                            o += '\\b';
                            break;
                        case '\f':
                            o += '\\f';
                            break;
                        case '\n':
                            o += '\\n';
                            break;
                        case '\r':
                            o += '\\r';
                            break;
                        case '\t':
                            o += '\\t';
                            break;
                        default:
                            c = c.charCodeAt();
                            o += '\\u00' + Math.floor(c / 16).toString(16) +
                                (c % 16).toString(16);
                        }
                    }
                }
                return o + '"';
            };
        } 
    
        if (!String.prototype.supplant) {
            String.prototype.supplant = function (o) {
                return this.replace(/{([^{}]*)}/g,
                    function (a, b) {
                        var r = o[b];
                        return typeof r === 'string' || typeof r === 'number' ? r : a;
                    }
                );
            };
        }
    
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
            };
        }
    
        // CommonJS / npm / Ender.JS
        module.exports = {
            typeOf: typeOf,
            isEmpty: isEmpty
        };
        global.typeOf = global.typeOf || typeOf;
        global.isEmpty = global.isEmpty || isEmpty;
    }());
    
  provide("remedial", module.exports);
}(global));

// pakmanager:json2yaml
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  (function () {
      "use strict";
    
      var typeOf = require('remedial').typeOf
        ;
    
      function stringify(data) {
        var handlers
          , indentLevel = ''
          ;
    
        handlers = {
            "undefined": function () {
              // objects will not have `undefined` converted to `null`
              // as this may have unintended consequences
              // For arrays, however, this behavior seems appropriate
              return 'null';
            }
          , "null": function () {
              return 'null';
            }
          , "number": function (x) {
              return x;
            }
          , "boolean": function (x) {
              return x ? 'true' : 'false';
            }
          , "string": function (x) {
              // to avoid the string "true" being confused with the
              // the literal `true`, we always wrap strings in quotes
              return JSON.stringify(x);
            }
          , "array": function (x) {
              var output = ''
                ;
    
              if (0 === x.length) {
                output += '[]';
                return output;
              }
    
              indentLevel = indentLevel.replace(/$/, '  ');
              x.forEach(function (y) {
                // TODO how should `undefined` be handled?
                var handler = handlers[typeOf(y)]
                  ;
    
                if (!handler) {
                  throw new Error('what the crap: ' + typeOf(y));
                }
    
                output += '\n' + indentLevel + '- ' + handler(y);
                 
              });
              indentLevel = indentLevel.replace(/  /, '');
              
              return output;
            }
          , "object": function (x) {
              var output = ''
                ;
    
              if (0 === Object.keys(x).length) {
                output += '{}';
                return output;
              }
    
              indentLevel = indentLevel.replace(/$/, '  ');
              Object.keys(x).forEach(function (k) {
                var val = x[k]
                  , handler = handlers[typeOf(val)]
                  ;
    
                if ('undefined' === typeof val) {
                  // the user should do
                  // delete obj.key
                  // and not
                  // obj.key = undefined
                  // but we'll error on the side of caution
                  return;
                }
    
                if (!handler) {
                  throw new Error('what the crap: ' + typeOf(val));
                }
    
                output += '\n' + indentLevel + k + ': ' + handler(val);
              });
              indentLevel = indentLevel.replace(/  /, '');
    
              return output;
            }
          , "function": function () {
              // TODO this should throw or otherwise be ignored
              return '[object Function]';
            }
        };
    
        return '---' + handlers[typeOf(data)](data) + '\n';
      }
    
      module.exports.stringify = stringify;
    }());
    
  provide("json2yaml", module.exports);
}(global));

// pakmanager:jsontoyaml.com
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  jQuery(function () {
      "use strict";
    
      var YAML = require('json2yaml')
        , $ = require('jQuery')
        , $events = $('body')
        ;
    
      $events.on('click', '.js-convert', function () {
        var json = $('.js-json').val()
          , data
          , yml
          ;
    
        try {
          data = JSON.parse(json);
        } catch(e) {
          $('.js-yml').val(e.toString());
          return;
        }
    
        yml = YAML.stringify(data);
        $('.js-yml').val(yml);
      });
    
    });
    
  provide("jsontoyaml.com", module.exports);
}(global));