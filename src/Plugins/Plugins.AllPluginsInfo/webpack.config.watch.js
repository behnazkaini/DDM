'use strict';

var webpackConfig = require('./webpack.config.js');
var tsForkCheckerPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function () {
	var devConfigs = webpackConfig ;
  devConfigs.forEach((devConfig) => {
    devConfig.module.rules=  [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: require('os').cpus().length - 1,
              poolTimeout: Infinity // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
              transpileOnly: true
            }
          }
        ]
      }
    ]
    devConfig.devtool = 'source-map';
    devConfig.mode = 'development';
    devConfig.plugins= [
      new tsForkCheckerPlugin({
        typescript: {
          memoryLimit: 4096,
          configFile: path.resolve(__dirname, "tsconfig.json" )
        },
        async: false,
      })
    ];
  })

	return devConfigs;
};