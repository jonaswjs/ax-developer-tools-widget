/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://www.laxarjs.org
 */

import * as axMocks from 'laxar-mocks';
import ReactTestUtils from 'react-addons-test-utils';

describe( 'The developer-toolbar-widget', () => {

   let widgetDom;

   // fake the AxDeveloperToolsWidget presence in the opener window:
   window.opener = {
      axDeveloperTools: {
         buffers: {
            events: [],
            log: []
         }
      }
   };

   beforeEach( axMocks.setupForWidget() );

   beforeEach( () => {
      axMocks.widget.configure( {
         grid: {
            resource: 'gridSettings'
         },
         tabs: {
            parameter: 'tab'
         },
         detailsOn: [
            'isLaxarApplication'
         ]
      } );
   } );

   beforeEach( axMocks.widget.load );

   beforeEach( () => {
      widgetDom = axMocks.widget.render();
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   afterEach( axMocks.tearDown );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'offers a button that creates an outline around the host application widgets (R1.1)', () => {
      expect( widgetDom.querySelector( 'button.ax-developer-toolbar-outline' ) ).not.toEqual( null );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when a grid resource is published with grid configuration', () => {

      beforeEach( () => {
         axMocks.eventBus.publish( 'didReplace.gridSettings',
            {
               data: {
                  columns: {
                     count: 12,
                     gutter: 30,
                     padding: 0,
                     width: 64
                  }
               }
            }
         );
         axMocks.eventBus.flush();
      } );

      it( 'offer a button that causes a grid visualization layer to be shown in the host application (R2.1)',
         () => {
            expect( widgetDom.querySelector( 'button.ax-developer-toolbar-grid' ) ).not.toEqual( null );
         }
      );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'allows for the grid visualization layer to be configured through a resource (R2.2)', () => {
      expect( axMocks.widget.axEventBus.subscribe ).toHaveBeenCalledWith(
         'didReplace.gridSettings', jasmine.any( Function )
      );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when a empty grid resource is published', () => {

      it( 'hides the grid visualization button (R2.3)', () => {
         expect( widgetDom.querySelector( 'button.ax-developer-toolbar-grid' ) ).toEqual( null );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when the state of the flag about running laxar application is true', () => {

      beforeEach( () => {
         axMocks.eventBus.publish( 'didChangeFlag.isLaxarApplication.true', {
            flag: 'isLaxarApplication',
            state: true
         } );
         axMocks.eventBus.flush();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'shows a toolbar (R3.1)', () => {
         expect( widgetDom.querySelector( 'button.ax-developer-toolbar-outline' ) ).not.toEqual( null );
         expect( widgetDom.querySelector( '.developer-toolbar-hint' ) ).toEqual( null );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when the state of the flag about running laxar application is false', () => {

      beforeEach( () => {
         axMocks.eventBus.publish( 'didChangeFlag.isLaxarApplication.false', {
            flag: 'isLaxarApplication',
            state: false
         } );
         axMocks.eventBus.flush();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'shows a message (R3.1)', () => {
         expect( widgetDom.querySelector( '.developer-toolbar-hint' ) ).not.toEqual( null );
         expect( widgetDom.querySelector( 'button.ax-developer-toolbar-outline' ) ).toEqual( null );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'show a tab bar with three tabs (R4.1)', () => {
      expect( widgetDom.querySelectorAll( 'ul.nav-tabs>li' ).length ).toEqual( 3 + 1 );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'provides widget areas (R4.2)', () => {
      expect( selectWidgetArea( 'events' ) ).not.toEqual( null );
      expect( selectWidgetArea( 'page' ) ).not.toEqual( null );
      expect( selectWidgetArea( 'log' ) ).not.toEqual( null );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'changes the visibility of the provided widget areas after a navigation (R4.3)', () => {

      expect( selectWidgetArea( 'events' ).style.display ).not.toEqual( 'none' );
      expect( selectWidgetArea( 'page' ).style.display ).toEqual( 'none' );
      expect( selectWidgetArea( 'log' ).style.display ).toEqual( 'none' );
      expect( axMocks.widget.axVisibility.updateAreaVisibility.calls.count() ).toEqual( 3 );

      axMocks.eventBus.publish( 'didNavigate.tools', {
         data: {
            tab: 'page'
         }
      } );
      axMocks.eventBus.flush();

      expect( selectWidgetArea( 'events' ).style.display ).toEqual( 'none' );
      expect( selectWidgetArea( 'page' ).style.display ).not.toEqual( 'none' );
      expect( selectWidgetArea( 'log' ).style.display ).toEqual( 'none' );
      expect( axMocks.widget.axVisibility.updateAreaVisibility.calls.count() ).toEqual( 6 );

      axMocks.eventBus.publish( 'didNavigate.tools', {
         data: {
            tab: 'events'
         }
      } );
      axMocks.eventBus.flush();

      expect( selectWidgetArea( 'events' ).style.display ).not.toEqual( 'none' );
      expect( selectWidgetArea( 'page' ).style.display ).toEqual( 'none' );
      expect( selectWidgetArea( 'log' ).style.display ).toEqual( 'none' );
      expect( axMocks.widget.axVisibility.updateAreaVisibility.calls.count() ).toEqual( 9 );

      axMocks.eventBus.publish( 'didNavigate.tools', {
         data: {
            tab: 'log'
         }
      } );
      axMocks.eventBus.flush();

      expect( selectWidgetArea( 'events' ).style.display ).toEqual( 'none' );
      expect( selectWidgetArea( 'page' ).style.display ).toEqual( 'none' );
      expect( selectWidgetArea( 'log' ).style.display ).not.toEqual( 'none' );
      expect( axMocks.widget.axVisibility.updateAreaVisibility.calls.count() ).toEqual( 12 );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function selectWidgetArea( name ) {
      return widgetDom.querySelector( `div[data-ax-widget-area="${name}"]` );
   }
} );

