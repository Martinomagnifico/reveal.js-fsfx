
/*****************************************************************
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/Martinomagnifico
 *
 * FsFx.js for Reveal.js 
 * Version 1.1.5
 * 
 * @license 
 * MIT licensed
 *
 * Thanks to:
 *  - Hakim El Hattab, Reveal.js 
 *  - Sindre Sorhus for Screenfull.js
 ******************************************************************/


(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FsFx = factory());
})(this, (function () { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /* eslint-disable promise/prefer-await-to-then */
  var methodMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'], // New WebKit
  ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'], // Old WebKit
  ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];

  var nativeAPI = function () {
    var unprefixedMethods = methodMap[0];
    var returnValue = {};

    var _iterator = _createForOfIteratorHelper(methodMap),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var methodList = _step.value;
        var exitFullscreenMethod = methodList === null || methodList === void 0 ? void 0 : methodList[1];

        if (exitFullscreenMethod in document) {
          var _iterator2 = _createForOfIteratorHelper(methodList.entries()),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _step2$value = _slicedToArray(_step2.value, 2),
                  index = _step2$value[0],
                  method = _step2$value[1];

              returnValue[unprefixedMethods[index]] = method;
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          return returnValue;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return false;
  }();

  var eventNameMap = {
    change: nativeAPI.fullscreenchange,
    error: nativeAPI.fullscreenerror
  }; // eslint-disable-next-line import/no-mutable-exports

  var screenfull = {
    // eslint-disable-next-line default-param-last
    request: function request() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.documentElement;
      var options = arguments.length > 1 ? arguments[1] : undefined;
      return new Promise(function (resolve, reject) {
        var onFullScreenEntered = function onFullScreenEntered() {
          screenfull.off('change', onFullScreenEntered);
          resolve();
        };

        screenfull.on('change', onFullScreenEntered);
        var returnPromise = element[nativeAPI.requestFullscreen](options);

        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenEntered).catch(reject);
        }
      });
    },
    exit: function exit() {
      return new Promise(function (resolve, reject) {
        if (!screenfull.isFullscreen) {
          resolve();
          return;
        }

        var onFullScreenExit = function onFullScreenExit() {
          screenfull.off('change', onFullScreenExit);
          resolve();
        };

        screenfull.on('change', onFullScreenExit);
        var returnPromise = document[nativeAPI.exitFullscreen]();

        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenExit).catch(reject);
        }
      });
    },
    toggle: function toggle(element, options) {
      return screenfull.isFullscreen ? screenfull.exit() : screenfull.request(element, options);
    },
    onchange: function onchange(callback) {
      screenfull.on('change', callback);
    },
    onerror: function onerror(callback) {
      screenfull.on('error', callback);
    },
    on: function on(event, callback) {
      var eventName = eventNameMap[event];

      if (eventName) {
        document.addEventListener(eventName, callback, false);
      }
    },
    off: function off(event, callback) {
      var eventName = eventNameMap[event];

      if (eventName) {
        document.removeEventListener(eventName, callback, false);
      }
    },
    raw: nativeAPI
  };
  Object.defineProperties(screenfull, {
    isFullscreen: {
      get: function get() {
        return Boolean(document[nativeAPI.fullscreenElement]);
      }
    },
    element: {
      enumerable: true,
      get: function get() {
        var _document$nativeAPI$f;

        return (_document$nativeAPI$f = document[nativeAPI.fullscreenElement]) !== null && _document$nativeAPI$f !== void 0 ? _document$nativeAPI$f : undefined;
      }
    },
    isEnabled: {
      enumerable: true,
      // Coerce to boolean in case of old WebKit.
      get: function get() {
        return Boolean(document[nativeAPI.fullscreenEnabled]);
      }
    }
  });

  if (!nativeAPI) {
    screenfull = {
      isEnabled: false
    };
  }

  var screenfull$1 = screenfull;

  var Plugin = function Plugin() {
    var selectionArray = function selectionArray(container, selectors) {
      var selections = container.querySelectorAll(selectors);
      var selectionarray = Array.prototype.slice.call(selections);
      return selectionarray;
    };

    var sfEnabled = function sfEnabled() {
      if (screenfull$1.enabled || screenfull$1.isEnabled) {
        return true;
      }

      return false;
    };

    var fullScreenEffects = function fullScreenEffects(deck, options) {
      var viewport = deck.getRevealElement().tagName == "BODY" ? document : deck.getRevealElement();
      var fsButtons = selectionArray(viewport, ".".concat(options.baseclass));
      var toggleThese = selectionArray(document, "[data-fs-toggle]");
      var prefix = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase()) ? '-moz-' : /webkit/.test(navigator.userAgent.toLowerCase()) ? '-webkit-' : /msie/.test(navigator.userAgent.toLowerCase()) ? '-ms-' : /opera/.test(navigator.userAgent.toLowerCase()) ? '-o-' : '';
      var fsStyleSheet = document.createElement("style");
      fsStyleSheet.type = "text/css";
      fsStyleSheet.innerText = ":".concat(prefix, "full-screen {background: var(--r-background-color)}");
      document.head.appendChild(fsStyleSheet);

      var hideIfNoFS = function hideIfNoFS(fsButton) {
        if (options.hideifnofs == true && !fsButton.hasAttribute("data-fs-gonext")) ; else {
          fsButton.style.display = "inline-block";

          fsButton.onclick = function () {
            deck.next();
          };
        }
      };

      var buttonCheck = function buttonCheck(fsButtons) {
        fsButtons.filter(function (fsButton) {
          fsButton.style.display = "inline-block";

          var goNext = function goNext() {
            if (parseInt(fsButton.dataset.fsGonext) > 0 && !screenfull$1.isFullscreen) {
              setTimeout(function () {
                deck.next();
              }, parseInt(fsButton.dataset.fsGonext));
            } else {
              deck.next();
            }
          };

          fsButton.onclick = function () {
            if (sfEnabled() == true) {
              if (fsButton.hasAttribute("data-fs-gonext")) {
                if (screenfull$1.isFullscreen) {
                  goNext();
                } else {
                  screenfull$1.request(viewport).then(goNext());
                }
              } else {
                screenfull$1.toggle(viewport);
              }
            } else {
              deck.next();
            }
          };
        });
      };

      var toggleCheck = function toggleCheck(toggleThese) {
        var fullscreenchange = function fullscreenchange() {
          if (screenfull$1.isFullscreen) {
            toggleThese.filter(function (toggleThis) {
              toggleThis.classList.add(toggleThis.dataset.fsToggle);
            });
          }

          if (!screenfull$1.isFullscreen) {
            toggleThese.filter(function (toggleThis) {
              toggleThis.classList.remove(toggleThis.dataset.fsToggle);
            });
          }
        };

        if (sfEnabled() == true) {
          document.addEventListener(screenfull$1.raw.fullscreenchange, fullscreenchange);
        }
      };

      if (!sfEnabled()) {
        console.log("The browser does not support the Fullscreen API.");
        document.body.classList.add("no-fsfx");
        fsButtons.filter(function (fsButton) {
          hideIfNoFS(fsButton);
        });
      } else {
        if (fsButtons.length > 0) {
          buttonCheck(fsButtons);
        } else {
          console.log("There are no FS buttons");
        }

        if (toggleThese.length > 0) {
          toggleCheck(toggleThese);
        } else {
          console.log("There are no elements with 'data-fs-toggle'.");
        }
      }
    };

    var init = function init(deck) {
      var defaultOptions = {
        baseclass: 'fsbutton',
        hideifnofs: true
      };

      var defaults = function defaults(options, defaultOptions) {
        for (var i in defaultOptions) {
          if (!options.hasOwnProperty(i)) {
            options[i] = defaultOptions[i];
          }
        }
      };

      var options = deck.getConfig().fsfx || {};
      defaults(options, defaultOptions);
      fullScreenEffects(deck, options);
    };

    return {
      id: 'fsfx',
      init: init
    };
  };

  return Plugin;

}));
