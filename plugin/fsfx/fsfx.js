
/*****************************************************************
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/Martinomagnifico
 *
 * FsFx.js for Reveal.js 
 * Version 1.0.8
 * 
 * @license 
 * MIT licensed
 *
 * Thanks to:
 *  - Hakim El Hattab, Reveal.js 
 *  - Sindre Sorhus, Screenfull.js
 ******************************************************************/


(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.FsFx = factory());
}(this, (function () { 'use strict';

	var Plugin = function Plugin() {
	  var selectionArray = function selectionArray(container, selectors) {
	    var selections = container.querySelectorAll(selectors);
	    var selectionarray = Array.prototype.slice.call(selections);
	    return selectionarray;
	  };

	  var sfCheck = function sfCheck() {
	    if (typeof screenfull !== "undefined" && (screenfull.enabled || screenfull.isEnabled)) {
	      return true;
	    }

	    return false;
	  };

	  var buttonCheck = function buttonCheck(deck, options) {
	    var viewport = deck.getRevealElement().tagName == "BODY" ? document : deck.getRevealElement();
	    var fsButtons = selectionArray(viewport, ".".concat(options.baseclass));
	    var toggleThese = selectionArray(document, "[data-fs-toggle]");
	    fsButtons.filter(function (fsButton) {
	      var goNext = function goNext() {
	        if (parseInt(fsButton.dataset.fsGonext) > 0 && !screenfull.isFullscreen) {
	          setTimeout(function () {
	            deck.next();
	          }, parseInt(fsButton.dataset.fsGonext));
	        } else {
	          deck.next();
	        }
	      };

	      if (options.hideifnofs == true && sfCheck() == false && !fsButton.hasAttribute("data-fs-gonext")) {
	        fsButton.style.display = "none";
	      }

	      fsButton.onclick = function () {
	        if (sfCheck() == true) {
	          if (fsButton.hasAttribute("data-fs-gonext")) {
	            if (screenfull.isFullscreen) {
	              goNext();
	            } else {
	              screenfull.request(viewport).then(goNext());
	            }
	          } else {
	            screenfull.toggle(viewport);
	          }
	        } else {
	          deck.next();
	        }
	      };
	    });

	    var fullscreenchange = function fullscreenchange() {
	      if (screenfull.isFullscreen) {
	        toggleThese.filter(function (toggleThis) {
	          toggleThis.classList.add(toggleThis.dataset.fsToggle);
	        });
	      }

	      if (!screenfull.isFullscreen) {
	        toggleThese.filter(function (toggleThis) {
	          toggleThis.classList.remove(toggleThis.dataset.fsToggle);
	        });
	      }
	    };

	    if (sfCheck() == true) {
	      document.addEventListener(screenfull.raw.fullscreenchange, fullscreenchange);
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

	    var options = deck.getConfig().appearance || {};
	    defaults(options, defaultOptions);
	    buttonCheck(deck, options);
	  };

	  return {
	    id: 'fsfx',
	    init: init
	  };
	};

	return Plugin;

})));
