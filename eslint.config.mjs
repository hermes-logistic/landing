// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // pen-assets/*.pen.js son payloads generados por pen.dev (cuerpos de módulo con
  // `return` a nivel superior, no ESM). Son assets, no código de aplicación.
  { ignores: ['pen-assets/**'] }
)
