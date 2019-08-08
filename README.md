# reveal.js-fsfx
A plugin for [Reveal.js](https://revealjs.com) that enables buttons to enter or exit fullscreen; with optional delay to go to a next slide. The plugin also toggles classes on elements at fullscreen events.


Sometimes you would like to have a button that starts a presentation *and* goes fullscreen at the same time, or rather *almost* the same time. This plugin does just that. And some other things.  


Here's a [demo](https://martinomagnifico.github.io/reveal.js-fsfx/demo.html) of a project that uses the FsFx.js plugin.


FsFx.js does multiple things:
* It sets a class for buttons that should switch the browser to fullscreen or exit it.
* Optional: It allows a fullscreen-button to also let Reveal.js go to the next slide, and set an optional delay for it. 
* Optional: It looks for elements in the presentation that need to have a class toggled on entering fullscreen and sets that class; it will remove the class on exiting fullscreen. The class can be set per element. Nice for an icon on the fullscreen button itself.



## Installation

FsFx.js needs one other (great) script to be able to function: [Screenfull.js](https://github.com/sindresorhus/screenfull.js) by [Sindre Sorhus](https://sindresorhus.com). This checks the capabilities of the browser to go fullscreen.

Copy the fsfx folder to the plugins folder of the reveal.js folder, like this: `plugin/fsfx`. Now add it to the dependencies of Reveal.js. You can do the same for screenfull.js or the minified version of it (although you can add it anywhere in your HTML).


```javascript
Reveal.initialize({
	// ...
	dependencies: [
		// ... 
		{ src: 'js/revealjs/plugin/fsfx/fsfx.js' },
		{ src: 'assets/js/screenfull.min.js'}
		// ... 
	]
});
```



## Configuration

There are a few options that you can change from the Reveal.js options. The values below are default and do not need to be set if they are not changed. 

```javascript
Reveal.initialize({
	// ...
	fsfx: {
		// The baseclass of the fullscreen button(s). Change it if you like
		baseclass: 'fsbutton',
		// Hide the buttons if fullscreen is not supported or if Screenfull is not available
		hideifnofs: true
	},
	dependencies: [
	// ... 
	]
});
```

The option 'hideifnofs' works like this: 
Any button that should enter or exit fullscreen can do that because it has the baseclass. However, if Screenfull (the script that checks the browser fullscreen capabilities), is either not loaded or decides that the browser does not support fullscreen, a fullscreen button just sits there unable to do anything. So the option 'hideifnofs' hides the button by default. This can be overruled by setting it to false.

A fullscreen button will not be hidden with the above option, if a `data-fs-gonext` attribute (explained below) is set. This means that that button's functionality will fall back to 'next slide' only, if there is no fullscreen support.



## Setup

It is easy to set up your fullscreen buttons. Adding the class 'fsbutton', or the class you put in the configuration, suffices: 

```html
<button class="fsbutton">Start the show!</button>
```

Fullscreen buttons will *toggle* the fullscreen state of the browser, unless the below data-fs-gonext attribute is set. It will then only go fullscreen, not back.

#### Optional 'Next slide' functionality

Add a data-fs-gonext attribute to the button. It would be wise to give it a value. If this is set, the browser will go fullscreen and then go to the next Reveal screen after the set time. If the browser is already fullscreen, it will not toggle back to windowed mode but will stay fullscreen and directly go to the next screen.  

```html
<button class="fsbutton" data-fs-gonext="2000">Start the show!</button>
```
#### Optional class toggle functionality

```html
<p data-fs-toggle="hide">I have the class 'hide' in fullscreen</p>
```



## Like it?

If you like it, please star this repo.




## License
MIT licensed

Copyright (C) 2019 Martijn De Jongh (Martino)
