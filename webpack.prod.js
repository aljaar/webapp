const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Critters = require('critters-webpack-xplugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    assetModuleFilename: 'images/image.[hash:8][ext][query]',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '.',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css',
      chunkFilename: 'css/[name].[chunkhash:8].chunk.js',
    }),
    new WebpackPwaManifest({
      id: 'aljaar-pwa-1',
      publicPath: '/',
      name: 'Aljaar',
      filename: 'app.webmanifest',
      start_url: './index.html',
      short_name: 'Aljaar',
      description: 'Share More, Waste Less',
      background_color: '#ffffff',
      theme_color: '#15803d',
      crossorigin: 'use-credentials',
      fingerprints: false,
      ios: true,
      icons: [
        {
          src: path.resolve('src/public/icon.png'),
          sizes: [180],
          destination: path.join('icons', 'ios'),
          purpose: 'maskable',
          ios: true,
        },
        {
          src: path.resolve('src/public/icon-circle.png'),
          sizes: [72, 96, 128, 152, 192, 384], // multiple sizes
          destination: 'icons',
          purpose: 'maskable',
        },
        {
          src: path.resolve('src/public/icon-circle.png'),
          sizes: [144, 512], // multiple sizes
          destination: 'icons',
          purpose: 'any',
        },
      ],
    }),
    new GenerateSW({
      swDest: './sw.bundle.js',
      clientsClaim: true,
      skipWaiting: true,
      exclude: [
        /\.map$/,
        /\.LICENSE.txt$/,
      ],
      runtimeCaching: [
        {
          urlPattern: /https:\/\/fontbit.io\/css2\//,
          handler: 'StaleWhileRevalidate',
        },
        {
          urlPattern: /https:\/\/unpkg.com\//,
          handler: 'StaleWhileRevalidate',
        },
      ],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      // generateStatsFile: true,
      // statsOptions: { source: false },
    }),
    new Critters(),
  ],
});
