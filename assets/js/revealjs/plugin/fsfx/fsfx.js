/*****************************************************************
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/Martinomagnifico
 *
 * FsFx.js for Reveal.js 1.0.0
 *
 * @license 
 * MIT licensed
 *
 * Thanks to:
 *  - Hakim El Hattab, Reveal.js
 *  - Sindre Sorhus, Screenfull.js
 ******************************************************************/


const FsFx = window.FsFx || (function () {

	let options = Reveal.getConfig().fsfx || {};

	let defaultOptions = {
		baseclass: 'fsbutton',
		hideifnofs: true
	};

	const defaults = function (options, defaultOptions) {
		for (var i in defaultOptions) {
			if (!options.hasOwnProperty(i)) {
				options[i] = defaultOptions[i];
			}
		}
	}

	const selectionArray = function (container, selectors) {
		let selections = container.querySelectorAll(selectors);
		let selectionarray = Array.prototype.slice.call(selections);
		return selectionarray
	};

	const sfCheck = function () {
		if (typeof screenfull !== "undefined" && screenfull.enabled) {
			return true
		}
		return false
	}

	const buttonCheck = function () {
		let fsButtons = selectionArray(document, `:scope .${options.baseclass}`);
		let toggleThese = selectionArray(document, `:scope [data-fs-toggle]`);


		fsButtons.filter(fsButton => {

			if (options.hideifnofs == true && sfCheck() == false && !fsButton.hasAttribute("data-fs-gonext")) {
				fsButton.style.display = "none";
			}

			fsButton.onclick = function () {
				screenfull.toggle((document)[0]).then(function () {

					if (fsButton.hasAttribute("data-fs-gonext")) {

						if (parseInt(fsButton.dataset.fsGonext) > 0) {
							setTimeout((function () {
								return Reveal.next();
							}), parseInt(fsButton.dataset.fsGonext));
						} else {
							Reveal.next()
						}
					}

				});
			}
		});

		const fullscreenchange = function () {
			if (screenfull.isFullscreen) {
				toggleThese.filter(toggleThis => {
					toggleThis.classList.add(toggleThis.dataset.fsToggle);
				});
			}
			if (!screenfull.isFullscreen) {
				toggleThese.filter(toggleThis => {
					toggleThis.classList.remove(toggleThis.dataset.fsToggle);
				});
			}
		};
		document.addEventListener(screenfull.raw.fullscreenchange, fullscreenchange);
	}

	const init = function () {
		defaults(options, defaultOptions);
		buttonCheck();
	};

	return {
		init: init
	};

})();

Reveal.registerPlugin('fsfx', FsFx);
/* global Reveal */