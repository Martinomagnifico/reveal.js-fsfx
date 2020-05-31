
/*****************************************************************
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/Martinomagnifico
 *
 * FsFx.js for Reveal.js 
 * Version 1.0.9
 * 
 * @license 
 * MIT licensed
 *
 * Thanks to:
 *  - Hakim El Hattab, Reveal.js 
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

	  var sfEnabled = function sfEnabled() {
	    if (screenfull.enabled || screenfull.isEnabled) {
	      return true;
	    }

	    return false;
	  };

	  var fullScreenEffects = function fullScreenEffects(deck, options) {
	    var viewport = deck.getRevealElement().tagName == "BODY" ? document : deck.getRevealElement();
	    var fsButtons = selectionArray(viewport, ".".concat(options.baseclass));
	    var toggleThese = selectionArray(document, "[data-fs-toggle]");

	    var hideIfNoFS = function hideIfNoFS(fsButton) {
	      if (options.hideifnofs == true && !fsButton.hasAttribute("data-fs-gonext")) {
	        fsButton.style.display = "none";
	      } else {
	        fsButton.onclick = function () {
	          deck.next();
	        };
	      }
	    };

	    var buttonCheck = function buttonCheck(fsButtons) {
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

	        fsButton.onclick = function () {
	          if (sfEnabled() == true) {
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
	    };

	    var toggleCheck = function toggleCheck(toggleThese) {
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

	      if (sfEnabled() == true) {
	        document.addEventListener(screenfull.raw.fullscreenchange, fullscreenchange);
	      }
	    };

	    if (typeof screenfull !== "undefined") {
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
	    } else {
	      fsButtons.filter(function (fsButton) {
	        hideIfNoFS(fsButton);
	      });
	      console.log("Screenfull.js did not load");
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

})));
