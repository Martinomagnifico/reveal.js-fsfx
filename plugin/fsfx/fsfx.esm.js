
/*****************************************************************
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/Martinomagnifico
 *
 * FsFx.js for Reveal.js 
 * Version 1.2.0
 * 
 * @license 
 * MIT licensed
 *
 * Thanks to:
 *  - Hakim El Hattab, Reveal.js 
 *  - Sindre Sorhus for Screenfull.js
 ******************************************************************/


/* eslint-disable promise/prefer-await-to-then */
const methodMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'], // New WebKit
['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'], // Old WebKit
['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];

const nativeAPI = (() => {
  const unprefixedMethods = methodMap[0];
  const returnValue = {};

  for (const methodList of methodMap) {
    const exitFullscreenMethod = methodList === null || methodList === void 0 ? void 0 : methodList[1];

    if (exitFullscreenMethod in document) {
      for (const [index, method] of methodList.entries()) {
        returnValue[unprefixedMethods[index]] = method;
      }

      return returnValue;
    }
  }

  return false;
})();

const eventNameMap = {
  change: nativeAPI.fullscreenchange,
  error: nativeAPI.fullscreenerror
}; // eslint-disable-next-line import/no-mutable-exports

let screenfull = {
  // eslint-disable-next-line default-param-last
  request() {
    let element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.documentElement;
    let options = arguments.length > 1 ? arguments[1] : undefined;
    return new Promise((resolve, reject) => {
      const onFullScreenEntered = () => {
        screenfull.off('change', onFullScreenEntered);
        resolve();
      };

      screenfull.on('change', onFullScreenEntered);
      const returnPromise = element[nativeAPI.requestFullscreen](options);

      if (returnPromise instanceof Promise) {
        returnPromise.then(onFullScreenEntered).catch(reject);
      }
    });
  },

  exit() {
    return new Promise((resolve, reject) => {
      if (!screenfull.isFullscreen) {
        resolve();
        return;
      }

      const onFullScreenExit = () => {
        screenfull.off('change', onFullScreenExit);
        resolve();
      };

      screenfull.on('change', onFullScreenExit);
      const returnPromise = document[nativeAPI.exitFullscreen]();

      if (returnPromise instanceof Promise) {
        returnPromise.then(onFullScreenExit).catch(reject);
      }
    });
  },

  toggle(element, options) {
    return screenfull.isFullscreen ? screenfull.exit() : screenfull.request(element, options);
  },

  onchange(callback) {
    screenfull.on('change', callback);
  },

  onerror(callback) {
    screenfull.on('error', callback);
  },

  on(event, callback) {
    const eventName = eventNameMap[event];

    if (eventName) {
      document.addEventListener(eventName, callback, false);
    }
  },

  off(event, callback) {
    const eventName = eventNameMap[event];

    if (eventName) {
      document.removeEventListener(eventName, callback, false);
    }
  },

  raw: nativeAPI
};
Object.defineProperties(screenfull, {
  isFullscreen: {
    get: () => Boolean(document[nativeAPI.fullscreenElement])
  },
  element: {
    enumerable: true,
    get: () => document[nativeAPI.fullscreenElement] ?? undefined
  },
  isEnabled: {
    enumerable: true,
    // Coerce to boolean in case of old WebKit.
    get: () => Boolean(document[nativeAPI.fullscreenEnabled])
  }
});

if (!nativeAPI) {
  screenfull = {
    isEnabled: false
  };
}

var screenfull$1 = screenfull;

const Plugin = () => {
  const isObject = item => {
    return item && typeof item === 'object' && !Array.isArray(item);
  };

  const mergeDeep = function (target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, {
            [key]: {}
          });
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, {
            [key]: source[key]
          });
        }
      }
    }

    return mergeDeep(target, ...sources);
  };

  const selectionArray = function (container, selectors) {
    let selections = container.querySelectorAll(selectors);
    let selectionarray = Array.prototype.slice.call(selections);
    return selectionarray;
  };

  const siblings = elem => {
    let siblings = [];

    if (!elem.parentNode) {
      return siblings;
    }

    let sibling = elem.parentNode.firstElementChild || elem.parentNode.firstChild;

    while (sibling) {
      if (sibling !== elem && sibling.nodeType === Node.ELEMENT_NODE) siblings.push(sibling);
      sibling = sibling.nextElementSibling || sibling.nextSibling;
    }

    return siblings;
  };

  const fullScreenEffects = function (deck, options) {
    const sfEnabled = function () {
      if (options.debugfsdisabled) {
        return false;
      }

      if (typeof screenfull$1 !== "undefined") {
        if (screenfull$1.enabled || screenfull$1.isEnabled) {
          return true;
        }

        return false;
      } else return false;
    };

    if (options.compatibility) {
      console.log("FsFx runs in compatibility mode. Please go to https://github.com/martinomagnifico/reveal.js-fsfx to check the recent changes. Compatibility mode can be turned off if you are sure that fullscreen buttons are displayed correctly.");
    }

    let viewport = deck.getRevealElement().tagName == "BODY" ? document : deck.getRevealElement();
    let revealElement = deck.getRevealElement();
    let slides = revealElement.querySelector(".slides");
    revealElement.style.setProperty('--r-opposite-color', options.auto.oppositecolor);
    revealElement.style.setProperty('--fsfx-color', options.auto.color);
    let fsfxStyle = document.querySelector('[title="fsfxstyle"]');

    if (typeof fsfxStyle == 'undefined' || fsfxStyle == null) {
      let prefix = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase()) ? '-moz-' : /webkit/.test(navigator.userAgent.toLowerCase()) ? '-webkit-' : /msie/.test(navigator.userAgent.toLowerCase()) ? '-ms-' : /opera/.test(navigator.userAgent.toLowerCase()) ? '-o-' : '';
      fsfxStyle = document.createElement('style');
      fsfxStyle.title = "fsfxstyle"; // style.appendChild(document.createTextNode('div {border: 1px solid red}'));

      let fsfxcss = `:${prefix}full-screen {background: var(--r-background-color)}@font-face{font-family:'fsfx';src: url(data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAWcAAsAAAAABVAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxEMrGNtYXAAAAFoAAAAXAAAAFwAaQDdZ2FzcAAAAcQAAAAIAAAACAAAABBnbHlmAAABzAAAAagAAAGol0gf52hlYWQAAAN0AAAANgAAADYevkEjaGhlYQAAA6wAAAAkAAAAJAfCA8dobXR4AAAD0AAAABgAAAAYDgAACmxvY2EAAAPoAAAADgAAAA4A/ACObWF4cAAAA/gAAAAgAAAAIAAJAENuYW1lAAAEGAAAAWIAAAFiTFMt/nBvc3QAAAV8AAAAIAAAACAAAwAAAAMDVQGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAQAAAAC0DwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAwAAAAMAAAAcAAEAAwAAABwAAwABAAAAHAAEAEAAAAAMAAgAAgAEAAEAIAArAC3//f//AAAAAAAgACsALf/9//8AAf/j/9n/2AADAAEAAAAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAACAAD/wAQAA8AAHwBAAAABNjIXFhQHMQEhMhYfARQGIzEhIiY1MRE0NjMyFhUxEQEyFhUxERQGIyImNTERAQ4BLwEmNDcxASEiJi8BNDYzMQGCChwKCgr+wwECDhMBARQP/qsOFBQODhQDmg4UFA4OFP7DChkKBAoKAT3+/g4TAQEUDwFyCgoKHQr+wxENBA4UFA4BVQ8UFA/+/QOMFA7+qw8UFA8BAv7DCQEIAgodCgE9EQ0EDhQAAgAK/8cD9gO2AB8AQAAAATYyFxYUBzEBITIWFxUUBiMxISImNTERNDYzMhYVMREHMhYVMREUBiMiJjUxEQEOAS8BJjQ3MQEhIiYnNTQ2MzEDxgocCgoK/sMBAw0TAhQO/qoOFBQODhTuDhQUDg8U/sMJGgoDCgoBPf79DRMCFA4DtgoKChwK/sMSDQQOFBQOAVYOFBQO/v39FA7+qg4UFA4BA/7DCQIIAwocCgE9Eg0EDhQAAQAAAAEAAOz603dfDzz1AAsEAAAAAADdz35TAAAAAN3PflMAAP/ABAADwAAAAAgAAgAAAAAAAAABAAADwP/AAAAEAAAAAAAEAAABAAAAAAAAAAAAAAAAAAAABgQAAAAAAAAAAAAAAAIAAAAEAAAABAAACgAAAAAACgAUAB4AegDUAAAAAQAAAAYAQQACAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAQAAAABAAAAAAACAAcARQABAAAAAAADAAQALQABAAAAAAAEAAQAWgABAAAAAAAFAAsADAABAAAAAAAGAAQAOQABAAAAAAAKABoAZgADAAEECQABAAgABAADAAEECQACAA4ATAADAAEECQADAAgAMQADAAEECQAEAAgAXgADAAEECQAFABYAFwADAAEECQAGAAgAPQADAAEECQAKADQAgGZzZngAZgBzAGYAeFZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMGZzZngAZgBzAGYAeGZzZngAZgBzAGYAeFJlZ3VsYXIAUgBlAGcAdQBsAGEAcmZzZngAZgBzAGYAeEZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=) format('woff');font-weight:normal;font-style:normal;}.icon-fs:after{font-family:'fsfx';content:'+';line-height:1;width:1em;height:1em;font-style:normal;font-weight:normal;font-variant:normal;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.icon-fsexit:after{content:'-'}`;
      fsfxStyle.appendChild(document.createTextNode(fsfxcss));
      document.head.appendChild(fsfxStyle);
    }

    if (options.auto) {
      if (options.auto.generate) {
        let alreadyHasFsButton = false;
        const slideSiblings = siblings(slides);
        slideSiblings.forEach(slideSibling => {
          if (slideSibling.classList.contains(options.baseclass) || slideSibling.querySelector(`.${options.baseclass}`)) {
            alreadyHasFsButton = true;
          }
        });

        if (!alreadyHasFsButton) {
          let fsbtn = document.createElement('button');
          fsbtn.className = `${options.baseclass} fsfxautobutton icon-fs`;
          fsbtn.dataset.fsToggle = "icon-fsexit";
          revealElement.insertBefore(fsbtn, revealElement.childNodes[0]);
        }
      }

      if (options.auto.position) {
        const autofsfxStyle = document.createElement('style');
        let positions = {};
        let thisid = ".reveal";

        if (deck.getConfig().embedded == true) {
          const generateID = () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
          };

          let unid = "";
          unid = deck.getRevealElement().id ? deck.getRevealElement().id : generateID();
          thisid = "#" + unid + ".reveal";

          if (!deck.getRevealElement().id) {
            deck.getRevealElement().setAttribute("id", unid);
          }
        }

        positions.top = options.auto.position.top ? options.auto.position.top : "auto";
        positions.right = options.auto.position.right ? options.auto.position.right : "auto";
        positions.bottom = options.auto.position.bottom ? options.auto.position.bottom : "auto";
        positions.left = options.auto.position.left ? options.auto.position.left : "auto";
        autofsfxStyle.innerHTML = `${thisid} .fsfxautobutton{display:inline-flex;border-radius:6px;text-decoration:none;cursor:pointer;text-align:center;appearance:none;-webkit-appearance:none;-moz-appearance:none;border:none;-webkit-transition:opacity .15s ease-in-out;-o-transition:opacity .15s ease-in-out;transition:opacity .15s ease-in-out;margin:0;padding:0; font-size:1rem;line-height: 1;z-index:2;position:absolute;z-index:2;border-width: 1.5px;border-style: solid;background: none;color: var(--fsfx-color, --r-main-color);font-size:1rem;font-size: clamp(1rem, 1vw + 1rem, 2rem);padding: 6px;opacity: 0.5;top: ${positions.top}; left: ${positions.left}; bottom: ${positions.bottom}; right: ${positions.right}}${thisid} .fsfxautobutton:hover {opacity: 1;}${thisid}.has-light-background .fsfxautobutton {color: var(--r-opposite-color, #000);}${thisid}.has-dark-background .fsfxautobutton {color: var(--r-main-inverse-color, #fff)}${thisid}.no-fsfx-button .fsfxautobutton {${options.nofsfxCss}}`;
        document.head.appendChild(autofsfxStyle);
      }
    }

    let fsButtons = revealElement.querySelectorAll(`.${options.baseclass}`);
    let toggleThese = selectionArray(document, "[data-fs-toggle]");
    fsButtons.forEach(fsButton => {
      let hidebutton = true;

      if (options.compatibility) {
        if (fsButton.id != "fsfxautobutton") {
          fsButton.style.display = "inline-block";
        }
      }

      if (options.hideifnofs == false || fsButton.dataset.fsGonext) {
        hidebutton = false;
      }

      if (!sfEnabled() && hidebutton) {
        fsButton.style.cssText += "pointer-events: none";
        let nofsfxCss = fsButton.dataset.nofsfxCss || options.nofsfxCss || '';
        fsButton.style.cssText += nofsfxCss;
      }

      fsButton.onclick = function () {
        if (fsButton.dataset.fsGonext && fsButton.dataset.fsGonext > 0) {
          if (screenfull$1.isFullscreen || !sfEnabled()) {
            deck.next();
          } else {
            screenfull$1.request(viewport).then(setTimeout(function () {
              deck.next();
            }, parseInt(fsButton.dataset.fsGonext)));
          }
        } else {
          screenfull$1.toggle(viewport);
        }
      };
    });

    const toggleCheck = function (toggleThese) {
      const fullscreenchange = function () {
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
    } else {
      if (!fsButtons.length) {
        console.log("There are no FS buttons");
      }

      if (toggleThese.length > 0) {
        toggleCheck(toggleThese);
      } else {
        console.log("There are no elements with 'data-fs-toggle'.");
      }
    }
  };

  const init = function (deck) {
    let defaultOptions = {
      baseclass: 'fsbutton',
      hideifnofs: true,
      nofsfxCss: 'display: none;',
      compatibility: true,
      auto: {
        generate: true,
        color: 'var(--r-main-color)',
        oppositecolor: 'black',
        position: {
          right: '20px',
          top: '20px'
        }
      },
      debugfsdisabled: false
    };
    let options = deck.getConfig().fsfx || {};
    options = mergeDeep(defaultOptions, options);
    fullScreenEffects(deck, options);
  };

  return {
    id: 'fsfx',
    init: init
  };
};

export { Plugin as default };
