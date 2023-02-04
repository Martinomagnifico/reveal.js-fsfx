# FsFx

[![Version](https://img.shields.io/npm/v/reveal.js-fsfx)](#) [![Downloads](https://img.shields.io/npm/dt/reveal.js-fsfx)](https://github.com/Martinomagnifico/reveal.js-fsfx/archive/refs/heads/master.zip)

A plugin for [Reveal.js](https://revealjs.com) 4, that enters or exits fullscreen, and toggles classes on certain elements.

[![Screenshot](https://martinomagnifico.github.io/reveal.js-fsfx/screenshot.png)](https://martinomagnifico.github.io/reveal.js-fsfx/demo.html)

Sometimes you would like to have a button that starts a presentation *and* goes fullscreen at the same time. This plugin does just that. And some other things.  

Here's a [demo](https://martinomagnifico.github.io/reveal.js-fsfx/demo.html) of a project that uses the FsFx.js plugin.


FsFx.js does multiple things:

* It sets a class for buttons that should switch the browser to fullscreen or exit it. On unsupported devices, these buttons get configurable styling.
* Optional: It allows a fullscreen-button to also let Reveal.js go to the next slide, and set an optional delay for it. 
* Optional: It looks for elements in the presentation that need to have a class toggled on entering fullscreen and sets that class; it will remove the class on exiting fullscreen. The class can be set per element. Nice for an icon on the fullscreen button itself.
* Optional: in auto-mode, it is possible to auto-generate a single fullscreen button that is visible on all slides. The styling copies the style of the demo.


# Breaking changes

In previous versions FsFx would set the styling of fullscreen buttons to `display: inline-block` through JavaScript, if the Fullscreen API was supported. It would rely on the user setting `display:none` in their CSS, so that buttons in unsupported browsers would not be shown.

* From FsFx version 1.2.0 onwards, fullscreen buttons can be added to the markup in any way that the user wants: block, inline-block, flex or whatever. That is just part of the design process. Unsupported buttons can now be hidden by either a global configuration, or per element with a data-attribute. This way, buttons can also use other styling, like `opacity: 0`, to avoid shifting other elements in the markup.
* A compatibility mode is now added, and set to `true` by default. If you have removed the `display:none` from your styling (if that's what was used with a previous version of FsFx), then it is safe to turn off compatibility mode. 


# Non-breaking changes

* A new auto-mode has been added. See "[auto mode](#optional-auto-mode)" section below on how to use it.
* The icons like in the demo are automatically inserted in this plugin. See the "[Included icons](#included-icons)" section below on how to use it, even without auto-mode. 


## Installation

FsFx.js automatically includes a (great) script to be able to function: [Screenfull.js](https://github.com/sindresorhus/screenfull.js) by [Sindre Sorhus](https://sindresorhus.com). This checks the capabilities of the browser to go fullscreen.


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

There are two JavaScript files for FsFx, a regular one, `fsfx.js`, and a module one, `fsfx.esm.js`. You only need one of them:


#### Regular 
If you're not using ES modules, for example, to be able to run your presentation from the filesystem, you can add it like this:

```html
<script type="text/javascript" src="dist/reveal.js"></script>
<script type="text/javascript" src="plugin/fsfx/fsfx.js"></script>
<script>
    Reveal.initialize({
        ...
        plugins: [ FsFx ]
    });
</script>
```

#### As a module 
If you're using ES modules, you can add it like this:

```html
<script type="module">
    // This will need a server
    import Reveal from './dist/reveal.esm.js';
    import FsFx from './plugin/fsfx/fsfx.esm.js';
    Reveal.initialize({
        // ...
        plugins: [ FsFx ]
    });
</script>
```

## Configuration

There are a few options that you can change from the Reveal.js options. The values below are default and do not need to be set if they are not changed. 

```javascript
Reveal.initialize({
    // ...
    fsfx: {
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
    },
    plugins: [ FsFx ]
});
```


* **`baseclass`**: The baseclass of the fullscreen button(s). Change it if you like. 
* **`hideifnofs`**: Hide any fullscreen button if the fullscreen API is not supported. See [Unsupported browsers](#unsupported-browsers) section below. 
* **`nofsfxCss`**: *How* to hide any buttons that are hidden with the above setting, which applies one or multiple CSS rules. This can also be set per element with a data-attribute. See [Unsupported browsers](#unsupported-browsers) section below.
* **`compatibility`**: Older versions of FsFx rely on the user setting `display:none` in their CSS. If this is still the case in your styling, please remove that; then you can set `compatibility` to `false`.
* **`auto`**: Since FsFx 1.2.0, you can auto-generate a fullscreen button which is visible on every slide. See "[auto mode](#optional-auto-mode)" section below.
	* **`color`**: Reveal.js uses a variable called `--r-main-color`. This is the color for the text in the slides, and depends on the setting of this color in the theme. FsFx uses this main color by default for the auto-generated button, but it can be overruled with any CSS color. 
	* **`oppositecolor`**: When a slide has a background that is an inverted version of the regular background, the text in the slide should be inverted as well. Reveal.js does not change that main variable (becaue it would result in color changes during transitions), but sets a specific opposite color depending on the theme, inside the slides. Because we also want to target elements outside the slides, FsFx uses the `oppositecolor` option to create a variable called `--r-opposite-color`. This variable is then used in the auto-generated button, but it can also be used elsewhere.
	* **`position`**: This sets the position of the auto-generated button. You can also use `left` and `bottom` if needed.
* **`debugfsdisabled `**: If you're designing a presentation, and want to know what it looks like if there is no Fullscreen API support, set this to true. 


## HTML

### Manually adding buttons

It is easy to set up your fullscreen buttons in HTML. Adding the class 'fsbutton', or the class you put in the configuration, suffices: 

```html
<button class="fsbutton">Start the show!</button>
```

### Optional 'auto' mode

Fullscreen buttons can be added to your slides *manually*, as shown right above. However, it is much nicer to have a single fullscreen button which is visible on every slide, but not part of those slides. Adding HTML outside of the main slides might be difficult to do yourself, or could not be part of the development flow. 

You can now let FsFx auto-generate a (single) fullscreen button like that. This button is visible on every slide, except on slides with a data-attribute of `data-state="no-fsfx-button"`. On those slides it will be hidden or shown differently with the same style as the `nofsfxCss` setting. 

Auto-mode is turned on by default, but can be turned off in the configuration. 

FsFx will also check if there are already fullscreen buttons with the base class in the viewport, like in a menubar. If so, there will be no button generated even if auto-mode is enabled.


### Optional 'Next slide' functionality

This allows a fullscreen-button to also let Reveal.js go to the next slide, and set an optional delay for it. Add a `data-fs-gonext` attribute to the button. It would be wise to give it a value (in milliseconds).  

```html
<button class="fsbutton" data-fs-gonext="2000">Start the show!</button>
```

### Optional class toggle functionality
Add a `data-fs-toggle` attribute to any element. This adds that toggle-class to the element if the browser goes fullscreen. The easiest is to add it to the body, and then style your elements from that cascade, but per element is also possible:
  
```html
<p data-fs-toggle="hide">I have the class 'hide' in fullscreen</p>
```

## Styling

### Auto styling
If you let FsFx generate a fullscreen button (see "[auto mode](#optional-auto-mode)" section above), the styling for that is already included. 

### Manual styling
If you have other fullscreen buttons in your presentation, you should add the styling of the fullscreen buttons yourself, to fit in with the rest.

### Included icons
FsFx includes two icons that indicate entering or exiting full screen, see the screenshot above. 

* In auto-mode, they are already included in the generated button. 
* In manual mode, they can be added to your buttons with the class `icon-fs`. To make sure that this icon toggles with the toggle functionality, add the `data-fs-toggle="icon-fsexit"` to it as well, like this:

```html
<button class="fsbutton icon-fs" data-fs-toggle="icon-fsexit">Start the show!</button>
```




## Unsupported browsers

Several things happen when a the Fullscreen API is not supported: 

* A class of `no-fsfx` will be added to the body. You can use it to show warnings, hide elements etcetera.
* If the setting `hideifnofs` is set to `true`, which is the default setting, fullscreen buttons will be hidden. Otherwise, a fullscreen button just sits there unable to do anything because the Fullscreen API is not supported. Hiding the buttons does 2 things:
	*  It sets `pointer-events: none` to the buttons. 
	*  It sets the `nofsfxCss` global styling to it. To change this globally, for example to make the button transparent instead of not displayed at all, change the styling in the config like this:
		
		```javascript
	   nofsfxCss: 'opacity: 0'
		```
	*  The above style can also be set per element (which overrides the global setting), with a data-attribute of `data-nofsfx-css`. You can use this if you have several fullscreen buttons, but want different behaviour from them.
		  
		```html
		<button class="fsbutton" data-nofsfx-css="opacity: 0">Go fullscreen</button>
		```

A fullscreen button will **not** be hidden with the `hideifnofs` option, if a `data-fs-gonext` attribute (see "[HTML](#html)" section above) is **also** set. This means that that button's functionality will fall back to 'next slide' only, if there is no fullscreen support.


## Like it?

If you like it, please star this repo! 

And if you want to show off what you made with it, please do :-)


## License
MIT licensed

Copyright (C) 2022 Martijn De Jongh (Martino)
