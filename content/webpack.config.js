/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );

const basePlugins = [
   new webpack.ResolverPlugin( [
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin( 'package.json', [ 'browser', 'main' ] ),
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin( 'bower.json', [ 'main' ] )
   ] )
];

module.exports = {
   entry: {
      'app': './init.js',
      'vendor': [ 'polyfills', 'react', 'react-overlays', 'laxar','wireflow' ]
   },

   output: {
      path: path.resolve( './var/build/' ),
      publicPath: '/includes/widgets/laxar/laxar-developer-tools-widget/content/var/build/',
      filename: '[name].bundle.js'
   },

   basePlugins,
   plugins: basePlugins.concat( [
      new webpack.optimize.CommonsChunkPlugin( 'vendor', 'vendor.bundle.js' ),
      new webpack.SourceMapDevToolPlugin( {
         filename: '[name].bundle.js.map'
      } )
      // ,
      // new webpack.ProvidePlugin({
      //    jQuery: 'jquery',
      //    $: 'jquery',
      //    jquery: 'jquery'
      // })
   ] ),

   resolve: {
      root: [
         path.resolve( './lib' ),
         path.resolve( './node_modules' )
      ],
      extensions: [ '', '.js', '.jsx' ],
      alias: {
         'polyfills': path.resolve( './lib/laxar/dist/polyfills.js' ),
         'laxar-uikit': path.resolve( './lib/laxar-uikit' ),
         'default.theme': path.resolve( './lib/laxar-uikit/themes/default.theme' )
      }
   },

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader'
         },
         {
            test: /.spec.(jsx?|tsx?)$/,
            exclude: /(node_modules|bower_components)/,
            loader: './lib/laxar-mocks/spec-loader'
         },

         {  // load styles, images and fonts with the file-loader
            // (out-of-bundle in var/build/assets/)
            test: /\.(gif|jpe?g|png|ttf|woff2?|svg|eot|otf)(\?.*)?$/,
            loader: 'file-loader'
         },
         {  // ... after optimizing graphics with the image-loader ...
            test: /\.(gif|jpe?g|png|svg)$/,
            loader: 'img-loader?progressive=true'
         },
         {  // ... and resolving CSS url()s with the css loader
            // (extract-loader extracts the CSS string from the JS module returned by the css-loader)
            test: /\.(css|s[ac]ss)$/,
            loader: 'style-loader!css-loader'
         },
         {  // load scss files by precompiling with the sass-loader
            test: /\/default.theme\/.*\.s[ac]ss$/,
            loader: 'sass-loader'
         },
         {  // use a different config for the cube theme to have the correct style include-path
            test: /\/cube\.theme\/.*\.s[ac]ss$/,
            loader: 'sass-loader?config=sassLoaderCube'
         }
      ]
   },
   fileLoader: {
      name: 'assets/[name]-[sha1:hash:hex:6].[ext]'
   },
   sassLoader: {
      includePaths: [
         './lib/laxar-uikit/themes/default.theme/scss',
         './lib/laxar-uikit/scss',
         './lib/compass/core/stylesheets',
         './node_modules/bootstrap-sass/assets/stylesheets'
      ].map( p => path.resolve( __dirname, p ) )
   }
};
