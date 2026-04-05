const gulp = require("gulp");
const webpack = require('webpack');
const less = require('gulp-less');
const path = require('path');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const util = require('gulp-util');
const typescript = require('gulp-typescript');
const del = require('del');
const fs = require('fs');
const glob = require('glob');
const sourcemaps = require('gulp-sourcemaps');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const spritesmash = require('gulp-spritesmash');
const lowerCase = require('lower-case');
const through = require("through2");
const tfs = require('gulp-tfs-checkout');
const getAbsolutePath = pathInput => path.join(__dirname, pathInput);

const assetPath = {
	stylesPath: getAbsolutePath('../Content/Styles/index*'),
	targetCssFiles: '../build/Styles',
	targetJsFiles: getAbsolutePath('../build/'),
	spritePath: getAbsolutePath('../Content/Icon'),
	destinationTargetJsFiles: '/Applications/ExtraModel/Plugins.FilterGrid/build',
};



require('@didgah/build-tools/gulp-helper/gulp')({
	assetPath,
	webpack,
	gulp,
	less,
	cleanCSS,
	rename,
	util,
	typescript,
	del,
	fs,
	glob,
	sourcemaps,
	webpackDevConfig: require('./webpack.config.dev'),
	webpackProdConfig: require('./webpack.config.prod'),
	webpackWatchConfig : require('./webpack.config.watch'),
	runHashTask: false,
	spritesmith,
	spritesmash,
	buffer,
	lowerCase,
	through,
	tfs,
	bypassTranspileEnum: true,
	skipRemoveJsFiles:true,
	skipRemoveSharedJsFiles:true
});