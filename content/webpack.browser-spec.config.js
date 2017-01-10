/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

/**
 * Webpack configuration for *interactive in-browser testing*.
 * Generates a `spec-runner.html` file and a JS bundle with sourcemaps for each `spec-runner.js`.
 */

 /* eslint-env node */
const path = require( 'path' );
const process = require( 'process' );
const webpack = require( 'webpack' );
const WebpackJasmineHtmlRunnerPlugin = require( 'webpack-jasmine-html-runner-plugin' );

const baseConfig = require( './webpack.config' );
const config = Object.assign( {}, baseConfig );

config.entry = WebpackJasmineHtmlRunnerPlugin
   .entry( './widgets/**/spec/*.spec.js', './widgets/**/spec/*.spec.ts' );
config.output = {
   path: path.resolve( path.join( process.cwd(), 'spec-output' ) ),
   publicPath: '/spec-output/',
   filename: '[name].bundle.js'
};

config.plugins = config.basePlugins.concat( [
   new webpack.SourceMapDevToolPlugin( {
      filename: '[name].bundle.js.map'
   } ),
   new WebpackJasmineHtmlRunnerPlugin()
] );

module.exports = config;
