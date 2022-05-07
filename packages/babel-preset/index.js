/**
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = function aaccBabelPreset(
  api,
  {
    debug = false,

    typescript = false,
    typescriptOptions = {},

    react = false,
    reactOptions = {},
  } = {},
) {
  const env = api.env()
  const isDevelopment = env === 'development'

  const presets = [
    [
      require.resolve('@babel/preset-env'),
      {
        debug,
      },
    ],

    typescript && [
      require.resolve('@babel/preset-typescript'),
      typescriptOptions,
    ],

    react && [
      require.resolve('@babel/preset-react'),
      {
        development: isDevelopment,
        ...reactOptions,
      },
    ],
  ].filter(Boolean)

  const plugins = []

  return {
    presets,
    plugins,
  }
}
