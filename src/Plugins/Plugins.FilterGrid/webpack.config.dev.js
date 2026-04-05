'use strict';

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
module.exports = function () {
	var devConfig = webpackConfig;

	devConfig.forEach((config, index) => {
		devConfig[index].devtool = 'source-map';
		devConfig[index].mode = 'development';
		devConfig[index].plugins = (devConfig[index].plugins || []).concat(
		new webpack.DefinePlugin({
				'process.env': {
					'NODE_Min': JSON.stringify('dev')
				}
			})
		);
	});
	devConfig.devtool = 'source-map';
	return devConfig;
};
