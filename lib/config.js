const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HTMLPlugin = require('mini-html-webpack-plugin')
const chalk = require('chalk')
const template = require('./template')

const babel = {
  presets: [
    'babel-preset-env',
    'babel-preset-stage-0',
    'babel-preset-react',
  ].map(require.resolve)
}

const rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: babel
  },
  {
    test: /\.js$/,
    exclude: path.resolve(__dirname, '../node_modules'),
    include: [
      path.resolve(__dirname, '..'),
      path.resolve(__dirname, '../src'),
    ],
    loader: require.resolve('babel-loader'),
    options: babel
  },
  {
    test: /\.(md|mdx|jsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: babel
      },
      require.resolve('@mdx-js/loader')
    ]
  }
]

module.exports = {
  stats: 'none',
  resolve: {
    modules: [
      __dirname,
      path.join(__dirname, '../node_modules'),
      path.relative(process.cwd(), path.join(__dirname, '../node_modules')),
      'node_modules'
    ],
  },
  module: {
    rules
  },
  plugins: [
    new ProgressBarPlugin({
      width: '24',
      complete: '█',
      incomplete: chalk.gray('░'),
      format: [
        chalk.cyan('[mdx] :bar'),
        chalk.cyan(':percent'),
        chalk.gray(':elapseds :msg'),
      ].join(' '),
      summaryContent: [
        chalk.cyan('[mdx]'),
        chalk.gray('done '),
      ].join(' '),
      summary: false,
    }),
    new HTMLPlugin({
      template
    })
  ]
}
