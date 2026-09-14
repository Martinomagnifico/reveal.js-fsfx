<a href="https://npmjs.com/package/@vituum/vite-plugin-pug"><img src="https://img.shields.io/npm/v/@vituum/vite-plugin-pug.svg" alt="npm package"></a>
<a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/@vituum/vite-plugin-pug.svg" alt="node compatility"></a>

# ⚡️🐕 VitePug

```js
import pug from '@vituum/vite-plugin-pug'

export default {
    plugins: [
        pug()
    ],
    build: {
        rollupOptions: {
            input: ['index.pug.html']
        }
    }
}
```

* Read the [docs](https://vituum.dev/plugins/pug.html) to learn more about the plugin options.
* Use with [Vituum](https://vituum.dev) to get multi-page support.

## Basic usage

```html
<!-- index.pug -->
include /path/to/template.pug
```
or
```html
<!-- index.json  -->
{
  "template": "path/to/template.pug",
  "title": "Hello world"
}
```

### Requirements

- [Node.js LTS (20.x)](https://nodejs.org/en/download/)
- [Vite](https://vitejs.dev/)
