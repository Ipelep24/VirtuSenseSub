const commons = require('./webpack.commons');
const { merge } = require('webpack-merge');
const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = merge(commons, {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: './index.web.js',
  },
  output: {
    path: path.resolve(__dirname, `./Builds/web`),
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename], // ensures cache invalidates on config change
    },
  },
  experiments: {
    lazyCompilation: {
      entries: true,
      imports: true,
    },
    cacheUnaffected: true, // skips recompiling unchanged modules
  },
  module: {
    rules: [
      {
        test: /react-native-keyboard-manager/,
        use: 'ignore-loader',
      },
      {
        test: /react-native-agora-chat/,
        use: 'ignore-loader'
      },
      {
        test: /index\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: ['postcss-loader'],
      },
      {
        test: /\.(jpe?g|svg)$/i,
        type: 'asset/resource',
      }
    ],
  },
  devServer: {
    port: 9000,
    historyApiFallback: true,
    static: './',
    client: {
      overlay: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    },
  },
});