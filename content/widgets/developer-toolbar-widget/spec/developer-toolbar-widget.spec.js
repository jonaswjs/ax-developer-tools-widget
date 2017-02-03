/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://www.laxarjs.org
 */
define( [
   '../widget.json',
   'laxar-mocks',
   'laxar-react-adapter'
], function( descriptor, axMocks, axReactAdapter) {
   'use strict';

   describe( 'The developer-toolbar-widget', function() {
      let widgetDom;

      beforeEach( axMocks.createSetupForWidget( descriptor, { adapter: axReactAdapter } ) );
      beforeEach( () => {
         axMocks.widget.configure( {
            grid: {
               resource: 'gridSettings'
            }
         } );
      } );
      beforeEach( axMocks.widget.load );
      beforeEach( () => {
         widgetDom = axMocks.widget.render();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( axMocks.tearDown );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'allows for the grid visualization layer to be configured through a resource (R2.2)', function() {
         console.log( axMocks )
         expect( axMocks.widget.axEventBus.subscribe ).toHaveBeenCalledWith( 'didReplace.gridSettings', jasmine.any( Function ) );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

   } );
} );
