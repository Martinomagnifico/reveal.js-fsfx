# FsFx

[![Version](https://img.shields.io/npm/v/reveal.js-fsfx)](#) [![Downloads](https://img.shields.io/npm/dt/reveal.js-fsfx)](https://github.com/Martinomagnifico/reveal.js-fsfx/archive/refs/heads/master.zip)

A plugin for [Reveal.js](https://revealjs.com) 4, that enters or exits fullscreen, and toggles classes on certain elements.

[![Screenshot](https://martinomagnifico.github.io/reveal.js-fsfx/screenshot.png)](https://martinomagnifico.github.io/reveal.js-fsfx/demo.html)

Sometimes you would like to have a button that starts a presentation *and* goes fullscreen at the same time. This plugin does just that. And some other things.  

Here's a [demo](https://martinomagnifico.github.io/reveal.js-fsfx/demo.html) of a project that uses the FsFx.js plugin.


FsFx.js does multiple things:

* It sets a class for buttons that should switch the browser to fullscreen or exit it.
* Optional: It allows a fullscreen-button to also let Reveal.js go to the next slide, and set an optional delay for it. 
* Optional: It looks for elements in the presentation that need to have a class toggled on entering fullscreen and sets that class; it will remove the class on exiting fullscreen. The class can be set per element. Nice for an icon on the fullscreen button itself.



## Installation

The FsFx plugin has been rewritten for Reveal.js version 4.

If you want to use FsFx with an older version of Reveal, use the [1.0.7 version](https://github.com/Martinomagnifico/reveal.js-fsfx/releases).

FsFx.js needs one other (great) script to be able to function: [Screenfull.js](https://github.com/sindresorhus/screenfull.js) by [Sindre Sorhus](https://sindresorhus.com). This checks the capabilities of the browser to go fullscreen.


### Regular installation

Copy the fsfx folder to the plugins folder of the reveal.js folder, like this: `plugin/fsfx`.

### npm installation

This plugin is published to, and can be installed from, npm.

```console
npm install reveal.js-fsfx
```
The FsFx plugin folder can then be referenced from `node_modules/reveal.js-fsfx/plugin/fsfx `


## Setup

### JavaScript

```html
<script type="text/javascript" src="dist/reveal.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/screenfull@5.1.0/dist/screenfull.min.js"></script>
<script type="text/javascript" src="plugin/fsfx/fsfx.js"></script>
<script>
	Reveal.initialize({
		...
		plugins: [ FsFx ]
	});
</script>
```

### HTML

It is easy to set up your fullscreen buttons. Adding the class 'fsbutton', or the class you put in the configuration, suffices: 

```html
<button class="fsbutton">Start the show!</button>
```
#### Optional 'Next slide' functionality

This allows a fullscreen-button to also let Reveal.js go to the next slide, and set an optional delay for it. Add a `data-fs-gonext` attribute to the button. It would be wise to give it a value (in milliseconds).  

```html
<button class="fsbutton" data-fs-gonext="2000">Start the show!</button>
```

#### Optional class toggle functionality
Add a `data-fs-toggle` attribute to any element. This adds that toggle-class to the element if the browser goes fullscreen. The easiest is to add it to the body, and then style your elements from that cascade, but per element is also possible.
  
```html
<p data-fs-toggle="hide">I have the class 'hide' in fullscreen</p>
```


## Configuration

There are a few options that you can change from the Reveal.js options. The values below are default and do not need to be set if they are not changed. 

```javascript
Reveal.initialize({
	// ...
	fsfx: {
		baseclass: 'fsbutton',
		hideifnofs: true
	},
	plugins: [ FsFx ]
});
```


* **`baseclass`**: The baseclass of the fullscreen button(s). Change it if you like. 
* **`hideifnofs`**: Any button that should enter or exit fullscreen can do that because it has the baseclass. However, if Screenfull (the script that checks the browser fullscreen capabilities), is either not loaded or decides that the browser does not support fullscreen, a fullscreen button just sits there unable to do anything. So the option 'hideifnofs' hides the button by default. This can be overruled by setting it to false. 

A fullscreen button will **not** be hidden with the `hideifnofs` option, if a `data-fs-gonext` attribute (explained below) is **also** set. This means that that button's functionality will fall back to 'next slide' only, if there is no fullscreen support.


## Like it?

If you like it, please star this repo! 

And if you want to show off what you made with it, please do :-)


## License
MIT licensed

Copyright (C) 2020 Martijn De Jongh (Martino)
