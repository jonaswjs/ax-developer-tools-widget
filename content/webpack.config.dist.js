/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );

const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const baseConfig = require( './webpack.config.js' );

module.exports = Object.assign( {}, baseConfig, {
   output: {
      path: path.resolve( './var/dist/' ),
      publicPath: '/var/dist/',
      filename: '[name].bundle.min.js'
   },
   plugins: baseConfig.basePlugins.concat( [
      // make react happy
      new webpack.DefinePlugin( {
         'process.env': { 'NODE_ENV': JSON.stringify( 'production' ) }
      } ),
      new webpack.optimize.CommonsChunkPlugin( 'vendor', 'vendor.bundle.min.js' ),
      new webpack.optimize.DedupePlugin(),
      new webpack.SourceMapDevToolPlugin( { filename: '[name].bundle.min.js.map' } ),
      new webpack.optimize.UglifyJsPlugin( {
         compress: { warnings: false },
         sourceMap: true
      } ),
      new ExtractTextPlugin('[name].bundle.css')
   ] ),
   module: Object.assign( {}, baseConfig.module, {
      loaders: baseConfig.module.loaders.map( function( config ) {
         const test = config.test;
         const loader = config.loader;
         if( loader === 'style-loader!css-loader' ) {
            return {
               test,
               loader: ExtractTextPlugin.extract( 'css-loader' )
            };
         }
         return {
            test,
            loader
         };
      } )
   } )
} );
