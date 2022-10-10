import screenfull from './screenfull.js';

const Plugin = () => {

	const selectionArray = function (container, selectors) {
		let selections = container.querySelectorAll(selectors);
		let selectionarray = Array.prototype.slice.call(selections);
		return selectionarray
	};

	const sfEnabled = function () {
		if (screenfull.enabled || screenfull.isEnabled) {
			return true
		}
		return false
	}

	const fullScreenEffects = function (deck, options) {

		let viewport = (deck.getRevealElement()).tagName == "BODY" ? document : deck.getRevealElement();
		let fsButtons = selectionArray(viewport, ".".concat(options.baseclass));

		let toggleThese = selectionArray(document, "[data-fs-toggle]");

		let prefix = (/mozilla/.test(navigator.userAgent.toLowerCase()) && 
		!/webkit/.test(navigator.userAgent.toLowerCase())) ? '-moz-' : 
		(/webkit/.test(navigator.userAgent.toLowerCase())) ? '-webkit-' :
		(/msie/.test(navigator.userAgent.toLowerCase()))   ? '-ms-' :
		(/opera/.test(navigator.userAgent.toLowerCase()))  ? '-o-' : '';
		const fsStyleSheet = document.createElement("style");
		fsStyleSheet.type="text/css";
		fsStyleSheet.innerText = `:${prefix}full-screen {background: var(--r-background-color)}`;
		document.head.appendChild(fsStyleSheet);

		const hideIfNoFS = function (fsButton) {
			if (options.hideifnofs == true && !fsButton.hasAttribute("data-fs-gonext")) {} else {
				fsButton.style.display = "inline-block";
				fsButton.onclick = function () {
					deck.next();
				}
			}
		}

		const buttonCheck = function (fsButtons) {

			fsButtons.filter(function (fsButton) {

				fsButton.style.display = "inline-block";

				const goNext = function () {
					if (parseInt(fsButton.dataset.fsGonext) > 0 && !screenfull.isFullscreen) {
						setTimeout((function () {
							deck.next();
						}), parseInt(fsButton.dataset.fsGonext));
					} else {
						deck.next()
					}
				}

				fsButton.onclick = function () {

					if (sfEnabled() == true) {
						if (fsButton.hasAttribute("data-fs-gonext")) {

							if (screenfull.isFullscreen) {
								goNext();
							} else {
								screenfull.request(viewport).then(goNext());
								element.requestFullscreen()
							}
						} else {
							screenfull.toggle(viewport);
						}
					} else {
						deck.next()
					}
				}
			});
		}

		const toggleCheck = function (toggleThese) {

			const fullscreenchange = function () {
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
		}

		if (!sfEnabled()) {
			console.log("The browser does not support the Fullscreen API.");
			document.body.classList.add("no-fsfx");
			fsButtons.filter(function (fsButton) {
				hideIfNoFS(fsButton)
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
	}

	const init = function (deck) {

		let defaultOptions = {
			baseclass: 'fsbutton',
			hideifnofs: true
		};

		const defaults = function (options, defaultOptions) {
			for (let i in defaultOptions) {
				if (!options.hasOwnProperty(i)) {
					options[i] = defaultOptions[i];
				}
			}
		}

		let options = deck.getConfig().fsfx || {};

		defaults(options, defaultOptions);

		fullScreenEffects(deck, options);
	};

	return {
		id: 'fsfx',
		init: init
	};
};

export default Plugin;