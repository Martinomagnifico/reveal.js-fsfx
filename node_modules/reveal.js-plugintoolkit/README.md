# Reveal.js Plugin Toolkit

[![Version](https://img.shields.io/npm/v/reveal.js-plugintoolkit)](#) [![Downloads](https://img.shields.io/npm/dt/reveal.js-plugintoolkit)](https://github.com/martinomagnifico/reveal.js-plugintoolkit/archive/refs/heads/master.zip)

A toolkit for creating structured, maintainable Reveal.js plugins with standardized configuration management, CSS loading, and initialization patterns.

There are a few functionalities to the toolkit:

  - [PluginBase](#1-pluginbase)
  - [pluginCSS](#2-plugincss)
  - [pluginDebug](#3-plugindebug)
  - [Additional tools](#4-additional-tools)

These will be described in detail below.

Installation

```bash
npm install reveal.js-plugintoolkit
```

-------------------


## 1. PluginBase

PluginBase provides a base class for plugins that has standardized functionality for configuration management, initialization, and data sharing.


### Features

- **Configuration management**: Automatically merges default and user-provided configurations.
- **Initialization**: Provides a standardized way to initialize plugins with access to the Reveal.js API.
- **Data sharing**: Allows plugins to share data and methods with each other.
- **TypeScript support**: Provides TypeScript interfaces for better type safety and autocompletion.
- **JavaScript support**: Can be used in JavaScript projects as well.
- **Plugin interface**: Allows you to define additional methods that can be called from outside the plugin.

Here's a minimal plugin using PluginBase:

```javascript
import { PluginBase } from 'reveal.js-plugintoolkit';

// Minimal default configuration
const defaultConfig = {
  message: 'Hello World',
  display: true
};

// Simple initialization function that just logs config values
const init = (plugin, deck, config) => {
  if (config.display) {
    console.log(config.message);
  }
};

// Export the plugin
export default () => {
  const plugin = new PluginBase('minimal', init, defaultConfig);
  return plugin.createInterface();
};
```

or the same in TypeScript:

```typescript
import { PluginBase } from 'reveal.js-plugintoolkit';
import type { Api } from 'reveal.js';

// Define configuration interface
interface MinimalConfig {
  message: string;
  display: boolean;
}

// Minimal default configuration
const defaultConfig: MinimalConfig = {
  message: 'Hello World',
  display: true
};

// Simple initialization function that just logs config values
const init = (plugin: PluginBase<MinimalConfig>, deck: Api, config: MinimalConfig): void => {
  if (config.display) {
    console.log(config.message);
  }
};

// Export the plugin
export default () => {
  const plugin = new PluginBase<MinimalConfig>('minimal', init, defaultConfig);
  return plugin.createInterface();
};
```



The above code will generate this:

```javascript
import deepmerge from 'deepmerge';

export default () => {
  // Plugin implementation
  const plugin = {
    id: 'minimal',
    
    initializeConfig: function(deck) {
      const defaultConfig = { message: 'Hello World', display: true };
      const revealConfig = deck.getConfig();
      const userConfig = revealConfig['minimal'] || {};
      
      this.mergedConfig = deepmerge(defaultConfig, userConfig, {
        arrayMerge: (_, sourceArray) => sourceArray,
        clone: true
      });
    },
    
    getCurrentConfig: function() {
      if (!this.mergedConfig) {
        throw new Error('Plugin configuration has not been initialized');
      }
      return this.mergedConfig;
    },
    
    init: function(deck) {
      this.initializeConfig(deck);
      
      // Your simple init function
      const config = this.getCurrentConfig();
      if (config.display) {
        console.log(config.message);
      }
    }
  };
  
  // Return the interface
  return {
    id: plugin.id,
    init: (deck) => plugin.init(deck),
    getConfig: () => plugin.getCurrentConfig()
  };
};
```




## 2. pluginCSS

The toolkit provides a flexible CSS loading utility that simplifies plugin styling. The path is derived from the JS path that the plugin is loaded from. It is expected that the CSS is in the same location. If a path is correctly found, it will be inserted in the DOM.

The CSS filename is expected to be the same as the JS filename, and the following locations are checked:

- script-path/myplugin.css (same location as the JS)
- plugin/myplugin/myplugin.css (like other Reveal plugins)


### Usage

```typescript
import { pluginCSS } from 'reveal.js-plugintoolkit';

// Inside your plugin initialization function
await pluginCSS(plugin, config);

```

where config is still optional. The enhanced version of pluginCSS also detects whether your plugin was loaded as a file of its own, or was bundled into an application. It does that by looking for the plugin's own script tag, and failing that by looking at the file this toolkit is running inside of (`import.meta.url` in the ESM build, `document.currentScript` in the UMD build).

Loading through `<script src="myplugin.js">` and through `<script type="module">import MyPlugin from './myplugin.mjs'</script>` both leave a resolvable path, so the CSS is linked in as usual. Once the plugin is part of an application bundle there is no such path, so dynamic linking is skipped and `import` is the way to style your plugin. If that import is also omitted, a console warning will show that.

#### A note on the `EMPTY_IMPORT_META` build warning

Building a UMD bundle of your plugin will print `[EMPTY_IMPORT_META] import.meta may not be a valid syntax with the umd output format`. That is expected: the toolkit reads `import.meta.url` in the ESM build and lets the bundler swap `import.meta` for `{}` in the UMD build, where `document.currentScript` takes over instead. Nothing breaks. To silence it, add this to your own Vite config:

```typescript
build: {
    rollupOptions: {
        checks: {
            emptyImportMeta: false,
        },
        // your other options...
    },
},
```

To be able to test if the CSS is successfully loaded in any way like `import`, your plugin will need to add a variable to the root, where `pluginid` should be the actual plugin id of your plugin:

```css
:root {
    --cssimported-pluginid: true;
}
```


### Interface for the end user

If the user bundles your plugin into an application, the CSS will *NOT* be loaded automatically and a warning will be visible in the console where the user is encouraged to use `import`. 

If the user loads your plugin as a file of its own, the CSS *WILL* be loaded automatically, but the user has a choice of the path:

```javascript
Reveal.initialize({
    plugins: [ RevealMyPlugin ],
    'my-plugin': {
        csspath: './custom-themes/my-theme/my-plugin.css',
        // Other plugin options...
    }
});
```


If, by any chance, the end-user wants some other kind of loading mechanism, then he/she can set `cssautoload` in their config to `false` (if you indeed provide that as an option in your plugin). As may be clear from the code, you can always rename that option.

```javascript
Reveal.initialize({
    plugins: [ RevealMyPlugin ],
    'my-plugin': {
       'cssautoload': false, // Disable automatic CSS loading
        // Other plugin options...
    }
});
```




## 3. pluginDebug


When using different Reveal.js plugins, you may want to enable debug output for your plugin, but only if the user has enabled it.
If multiple plugins are active, then it might be useful to have a label for each plugin in the console output.
These two features are provided by this pluginDebug tooling.

The functionality needs to be enabled first. Otherwise, the pluginDebug object will not output anything.
Like this: 

```javascript
pluginDebug.initialize(true, 'MY-PLUGIN');
```
The first parameter enables the pluginDebug output, and the second parameter is the label that will be used in the console output. You will probably pass the first parameter from the config of your plugin when an end user turns logging on.

After initializing, you can use the pluginDebug object to log messages, create groups, and use other console methods.



### Basic logging

```javascript
pluginDebug.log('Application started');
```

Console output: 

```
[MY-PLUGIN]: Application started
```

### Using groups

```javascript
pluginDebug.group('User Authentication');
pluginDebug.log('Checking credentials');
pluginDebug.log('Validating token');
pluginDebug.groupEnd();
```

Console output:

```
▶ [MY-PLUGIN]: User Authentication
    Checking credentials
    Validating token
```


### Using other console methods

```javascript
pluginDebug.table(userData);

Console output: 
[MY-PLUGIN]: (followed by a table of userData)
```

- `pluginDebug.table(tableData)` - Display a table with default header
- `pluginDebug.table(tableData, columns)` - Display a table with specific columns
- `pluginDebug.table("Tablename:", tableData)` - Display a table with a custom message
- `pluginDebug.table("Tablename:", tableData, columns)` - Display a table with custom message and specific columns



## 4. Additional tools

### Extra events (`eventTools`)

When navigating in Reveal.js, you may want to know in which direction the user is navigating, or when a browser is resized, triggering scroll mode. The toolkit provides two functions that add events for these cases.

- `addDirectionEvents(deck)`: Emits events for horizontal and vertical navigation. Fires `slidechanged-h` and `slidechanged-v` when the user navigates in a certain direction.
- `addScrollModeEvents(deck)`: Emits events when a deck, by resizing, enters or exits scroll mode. Fires `scrollmode-enter` and `scrollmode-exit` when entering or exiting scroll mode.

```javascript
import { eventTools } from 'reveal.js-plugintoolkit';

eventTools.addDirectionEvents(deck);
eventTools.addScrollModeEvents(deck);

```

### The theme's colours (`themeTools`)

A deck can have a slide a background that contrasts the theme, and Reveal will then set a .has-dark-background or .has-light-background class on the reveal element and the section itself. The theme CSS knows how to handle colors then, but a plugin that needs styling outside the styles does not know *how* that is handled, what colors are used. The themeTools take care of that. It measures the colors of the themes and keeps those colors as variables on the viewport element.

- `addThemeColor(deck)`: Keeps `--c-theme-color` and `--c-theme-heading-color` on the viewport in step with the slide being shown, and puts the class `c-theme-inverted` there if the background contrasts the theme.

Body text and headings are measured separately, because a theme colours them differently: The heading in the “moon” template is `#eee8d5` compared to `#93a1a1` for body text, and “dracula” is `#bd93f9` for headings and `#f8f8f2` for bodycopy. On an inverted slide the bundled themes flatten both to one colour, and the measuring reports whatever the theme actually does.

Any plugin may call it. The first call on a deck measures and installs, later calls get the same colours back, so several plugins can ask without measuring the theme more than once.

```javascript
import { themeTools } from 'reveal.js-plugintoolkit';

themeTools.addThemeColor(deck);
```

Then a plugin needing colors on an element outside of the slides can follow the deck instead of hardcoding a colour:

```css
.my-plugin-thing {
    color: var(--c-theme-color, currentColor);
}

.my-plugin-accent {
    color: var(--c-theme-heading-color, currentColor);
}

.c-theme-inverted .my-plugin-thing {
    color: var(--my-plugin-color-inverted, var(--c-theme-color, currentColor));
}
```

The class is there so a deck can style that case without having to know whether its own theme is the light one or the dark one.

A slide can come by a contrasting background in three ways:

| How the slide gets its background | What Reveal marks |
| --- | --- |
| Its own `data-background-*` | the class on the Reveal element |
| The stack it sits in | the class on the stack `<section>` only, not on the deck |
| Either of those, in scroll view | the class on the viewport |

The themeTools handles them all.

### Slide states in scroll view (`stateTools`)

A slide can have a `data-state`. In the regular view Reveal puts it on the viewport as a class, together with the state of the stack a vertical slide sits in, and fires an event named after it. That is how a deck, or a plugin, hides or shows something for one slide only (like in Simplemenu):

```html
<section data-state="no-menu">...</section>
```

```css
.no-menu .my-plugin-bar {
    visibility: hidden;
}
```

Reveal's scroll view does neither of these. The slide on screen can have a state, and nothing on the page gets the class, so anything that is superimposed on the slides stays as it is. The stateTools fill that in. 

- `addSlideStates(deck)`: In scroll view, keeps the states of the slide on screen on the viewport, and fires an event named after each state that was not on the previous slide. The regular view is left to Reveal.

```javascript
import { stateTools } from 'reveal.js-plugintoolkit';

stateTools.addSlideStates(deck);
```

Call it from a plugin's `init`. Scroll view takes stacks apart, so the helper reads each stack's state before that happens and copies it onto the stack's vertical slides, as `data-toolkit-stack-state`. Called once the deck is already in scroll view, slides still get their own states, and stack states follow after the deck has left scroll view once.

Like Reveal, it puts the classes on the viewport: the body for a deck that has the page to itself, the deck itself when embedded, so two decks on one page keep their states apart. And like the other tools, any plugin may call it: the first call on a deck installs, later calls do nothing.

The classes are what most decks and plugins need: they cascade, so hiding or showing something is plain CSS. The events are there so that code written against Reveal's own state events keeps working in scroll view:

```javascript
deck.on('chart-slide', () => startChartAnimation());
```

A slide with several states, `no-controls no-menu no-progress` say, fires one event for each when it arrives, and none while the reader stays on it or moves to a slide that shares the state. An event that nothing listens to costs nothing. Reveal fires them in the regular view in the same way, without an option to turn them off. There is no event when a state goes away; listen to `slidechanged` and look at the viewport's classes for that.

In the regular view Reveal fires a state's event before `slidechanged`. In scroll view it comes after, because that is the event that reports the new slide.

In the future we may remove addSlideStates if it is no longer needed.

### Elements that stay on screen (`positionTools`)

A plugin that puts something over the slides, a menubar, a button, a logo, has to keep it at an edge of what the reader sees. Where that edge is depends on the deck:

- A deck that has the page to itself: the window. `position: fixed` works.
- An embedded deck: the deck's own box. `fixed` pins to the window instead, so the element ends up outside the deck.
- Scroll view, on an embedded deck: the deck itself scrolls, so an element that is simply placed in it scrolls away with the slides.

On top of that, Reveal adds sticky elements of its own in scroll view, and other plugins add theirs, in an order nobody controls.

- `addAnchor(deck, options)`: Adds a zero-height anchor to the deck that holds one edge, top or bottom, of what the reader sees, and returns it. Put the plugin's element inside.

```javascript
import { positionTools } from 'reveal.js-plugintoolkit';

const anchor = positionTools.addAnchor(deck, { edge: 'top', className: 'my-plugin-anchor' });
anchor.appendChild(myButton);
```

Then place the element against the anchor in the plugin's own CSS, with logical properties so that it follows the direction:

```css
.my-plugin-anchor > .my-plugin-button {
    position: absolute;
    top: 20px;
    inset-inline-end: 20px;
}
```

For a bottom anchor use `bottom` instead of `top`, and `inset-inline: 0` for a bar across the whole edge.

The anchor has no height, so `height: 100%` inside it is nothing. For an element that fills what the reader sees from top to bottom, like a side menu, the anchor has `--toolkit-anchor-height`: that height in pixels, the window's or the embedded deck's, and updated when it changes, fullscreen included.

```css
.my-menu-anchor > .my-menu {
    position: absolute;
    top: 0;
    inset-inline-start: -280px;
    width: 280px;
    height: var(--toolkit-anchor-height);
    overflow-y: auto;
    overscroll-behavior: contain;
    visibility: hidden;
    transition: inset-inline-start 0.3s, visibility 0s 0.3s;
}

.my-menu-anchor > .my-menu.open {
    inset-inline-start: 0;
    visibility: visible;
    transition: inset-inline-start 0.3s;
}
```

A menu like that also needs:

- **`data-prevent-swipe` on the menu.** The anchor is inside the deck, and Reveal turns a swipe anywhere in the deck into a slide change.
- **A `zIndex` above Reveal's own elements**, to cover them: the controls are at 11 and the slide number at 31. Reveal's overlays sit at 99 and up. The anchor's `z-index` is what counts, not the menu's.
- **A slide-in on a logical property**, like `inset-inline-start` above. `translate` does not turn around in a right-to-left deck, and `:dir(rtl)` does not see Reveal's `rtl` option, which sets `direction` and no `dir` attribute.

| Option | Default | What it does |
| --- | --- | --- |
| `edge` | `'top'` | `'top'` or `'bottom'`. |
| `zIndex` | `2` | The anchor's `z-index`. |
| `className` | | Classes for the anchor. |
| `print` | `'hide'` | `'keep'` leaves the anchor in Reveal's print view, where neither fixed nor sticky follows the pages. |

The anchor is fixed to the window on a deck that has the page to itself, and sticky, held at both edges, on an embedded deck. That leaves it exactly one place to be, wherever in the deck it ends up and however many anchors other plugins add. It follows Reveal's `rtl` option, also when `configure()` changes it, so `start` and `end` inside it follow the slides; without the option, it follows the page's own direction.

The styles are written on the anchor itself. No stylesheet is added to the page, so two plugins with different versions of the toolkit cannot style each other's anchors, and a Content Security Policy that blocks inline styles in markup does not block these. A deck's stylesheet can still override one with `!important`.

To hide the element on some slides, select through the viewport, where Reveal puts a slide's `data-state`: `.no-menu .my-plugin-anchor { visibility: hidden; }`. In scroll view that needs the [stateTools](#slide-states-in-scroll-view-statetools).

Every call adds a new anchor. Call it from a plugin's `init` or later.

### A note on scroll view and elements inside slides

When Reveal's scroll view switches off, Reveal does not move the slides back: it rebuilds them from a copy of their HTML that it took when scroll view switched on. Every element inside `.slides` is then a new element. Attributes and classes are in the copy, but event listeners and references a plugin kept are not.

So a plugin that reacts to something inside the slides should listen on the deck's element and match at the moment of the event, rather than add a listener to each element:

```javascript
deck.getRevealElement().addEventListener('click', (event) => {
    const button = event.target.closest('.my-plugin-button');
    if (button) { /* ... */ }
});
```

And look elements up when it needs them, rather than once at the start. Elements outside `.slides`, such as an anchor from `positionTools`, are not rebuilt.

### Some section functions (`sectionTools`)

- `isSection`: Check if the current slide is a section.
- `isStack`: Check if the current slide is a stack.
- `isVertical`: Check if the current section is vertical (is IN a stack).
- `isHorizontal`: Check if the current section is horizontal (is not a stack itself and is not in a stack).
- `getStack`: Get the stack of the current slide.
- `getSectionType`: Get the type of the current section (will return horizontal, vertical or stack).

```javascript
import { sectionTools } from 'reveal.js-plugintoolkit';

const isSection = sectionTools.isSection(slide);
const isStack = sectionTools.isStack(slide);
const isVertical = sectionTools.isVertical(slide);
const isHorizontal = sectionTools.isHorizontal(slide);
const stack = sectionTools.getStack(slide);
const sectionType = sectionTools.getSectionType(slide);
```

-------------------

### Getting all the tools

The tools above can also be imported with a single namespace:

```javascript
import { pluginTools } from 'reveal.js-plugintoolkit'
```


-------------------

## License

MIT licensed | Copyright © 2026 Martijn De Jongh (Martino)
