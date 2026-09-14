import { resolve, relative } from 'path'
import fs from 'fs'
import pug from 'pug'
import {
  getPackageInfo,
  deepMergeWith,
  pluginBundle,
  pluginMiddleware,
  pluginReload,
  pluginTransform,
  processData,
} from 'vituum/utils/common.js'
import { merge } from 'vituum/utils/merge.js'
import { renameBuildEnd, renameBuildStart } from 'vituum/utils/build.js'

const { name } = getPackageInfo(import.meta.url)

/**
 * @type {import('@vituum/vite-plugin-pug/types').PluginUserConfig}
 */
const defaultOptions = {
  reload: true,
  root: null,
  filters: {},
  globals: {
    format: 'pug',
  },
  data: ['src/data/**/*.json'],
  formats: ['pug', 'json.pug', 'json'],
  ignoredPaths: [],
  options: {},
}

const renderTemplate = async ({ filename, server, resolvedConfig }, content, options) => {
  const initialFilename = filename.replace('.html', '')
  const output = {}
  const context = options.data
    ? processData({
        paths: options.data,
        root: resolvedConfig.root,
      }, options.globals)
    : options.globals

  if (initialFilename.endsWith('.json')) {
    merge(context, JSON.parse(content))

    output.template = true

    if (typeof context.template === 'undefined') {
      const error = `${name}: template must be defined for file ${initialFilename}`

      return new Promise((resolve) => {
        output.error = error
        resolve(output)
      })
    }

    context.template = relative(resolvedConfig.root, context.template).startsWith(relative(resolvedConfig.root, options.root)) ? resolve(resolvedConfig.root, context.template) : resolve(options.root, context.template)
  }
  else if (fs.existsSync(`${initialFilename}.json`)) {
    merge(context, JSON.parse(fs.readFileSync(`${initialFilename}.json`).toString()))
  }

  return new Promise((resolve) => {
    try {
      const template = pug.compileFile(output.template ? context.template : server ? initialFilename : filename, Object.assign(options.options, {
        basedir: options.root,
        filters: options.filters,
      }))

      output.content = template(context)

      resolve(output)
    }
    catch (error) {
      output.error = error

      resolve(output)
    }
  })
}

/**
 * @param {import('@vituum/vite-plugin-pug/types').PluginUserConfig} options
 * @returns {import('vite').Plugin[]}
 */
const plugin = (options = {}) => {
  let resolvedConfig
  let userEnv

  options = deepMergeWith(defaultOptions, options)

  return [{
    name,
    config(userConfig, env) {
      userEnv = env
    },
    configResolved(config) {
      resolvedConfig = config

      if (!options.root) {
        options.root = config.root
      }
    },
    buildStart: async () => {
      if (userEnv.command !== 'build' || !resolvedConfig.build.rollupOptions.input) {
        return
      }

      await renameBuildStart(resolvedConfig.build.rollupOptions.input, options.formats)
    },
    buildEnd: async () => {
      if (userEnv.command !== 'build' || !resolvedConfig.build.rollupOptions.input) {
        return
      }

      await renameBuildEnd(resolvedConfig.build.rollupOptions.input, options.formats)
    },
    transformIndexHtml: {
      order: 'pre',
      /** @returns {Promise<string | Object>} */
      async handler(content, { path, filename, server }) {
        return pluginTransform(content, { path, filename, server }, { name, options, resolvedConfig, renderTemplate })
      },
    },
    handleHotUpdate: ({ file, server }) => pluginReload({ file, server }, options),
  }, pluginBundle(options.formats), pluginMiddleware(name, options.formats)]
}

export default plugin
