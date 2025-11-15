const webpack = require('webpack');
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
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
  plugins: [
    // Inject unload blocker at the very beginning
    new webpack.BannerPlugin({
      banner: `
if (typeof window !== 'undefined') {
  (function() {
    var _addEventListener = window.addEventListener;
    var _removeEventListener = window.removeEventListener;
    window.addEventListener = function(type, listener, options) {
      if (type === 'unload') {
        console.warn('[Deprecation Fix] Blocked unload event, using pagehide instead');
        return _addEventListener.call(this, 'pagehide', listener, options);
      }
      return _addEventListener.call(this, type, listener, options);
    };
    window.removeEventListener = function(type, listener, options) {
      if (type === 'unload') {
        return _removeEventListener.call(this, 'pagehide', listener, options);
      }
      return _removeEventListener.call(this, type, listener, options);
    };
  })();
}
      `,
      raw: true,
      entryOnly: true,
    }),
  ],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  experiments: {
    cacheUnaffected: true,
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