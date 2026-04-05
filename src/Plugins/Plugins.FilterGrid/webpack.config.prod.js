'use strict';

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function () {
	var prodConfig = webpackConfig;

	prodConfig.forEach((config, index) => {
		let addHash = false;
		Object.keys(config.entry).forEach(name => {
			if (name === 'shared') {
				addHash = true;
				config.output.filename = "[name].[contenthash].min.js";
				config.output.chunkFilename = "[name].[contenthash].min.js";
				config.output.chunkLoadingGlobal = config.output.library[0] + 'Jsonp';
			}
			else {
				config.output.filename = "[name].min.js";
			}
		})

		config.devtool = 'source-map';
		config.mode = 'production';
		config.plugins = (config.plugins || []).concat(
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('production'),
					'NODE_Min': JSON.stringify('min')
				}
			})
		);
		config.optimization = {
			minimizer: [
				new TerserPlugin({
					extractComments: false
				}),
			],
		};
		if (addHash) {
			config.optimization.moduleIds = 'deterministic'
		}
	});

	return prodConfig;
};
