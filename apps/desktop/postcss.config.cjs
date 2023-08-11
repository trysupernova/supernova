const uiConfig = require("@supernova/ui/postcss.config");

module.exports = {
  ...uiConfig,
  plugins: {
    '@pandacss/dev/postcss': {},
    ...uiConfig.plugins,
  }
}
