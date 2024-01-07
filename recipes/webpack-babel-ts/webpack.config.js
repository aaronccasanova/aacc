// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json')

/**
 * @type {import('webpack').Configuration}
 */
const commonConfig = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}

/**
 * @type {import('webpack').Configuration}
 */
const cjsConfig = {
  ...commonConfig,
  target: 'node',
  output: {
    path: path.join(__dirname, path.dirname(pkg.main)),
    filename: path.basename(pkg.main),
    library: {
      type: 'commonjs',
    },
  },
}

/**
 * @type {import('webpack').Configuration}
 */
const esmConfig = {
  ...commonConfig,
  output: {
    path: path.join(__dirname, path.dirname(pkg.module)),
    filename: path.basename(pkg.module),
    library: {
      type: 'module',
    },
    module: true,
  },
  experiments: {
    outputModule: true,
  },
}

/**
 * @type {import('webpack').Configuration}
 */
const browserConfig = {
  ...commonConfig,
  target: 'web',
  output: {
    path: path.join(__dirname, path.dirname(pkg.browser)),
    filename: path.basename(pkg.browser),
    library: {
      name: 'webpackBabelTs',
      type: 'umd',
    },
  },
}

module.exports = [cjsConfig, esmConfig, browserConfig]
