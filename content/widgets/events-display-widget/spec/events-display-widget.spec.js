/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import ReactTestUtils from 'react-addons-test-utils';
import descriptor from '../widget.json';
import * as specData from './spec-data.js';
import * as axMocks from 'laxar-mocks';
import * as axReactAdapter from 'laxar-react-adapter';

describe( 'An events-display-widget', function() {

   const bufferSize = 9;
   let widgetDom;
   let metaEvents;
   let metaEvents2;

   beforeEach( axMocks.createSetupForWidget( descriptor, { adapter: axReactAdapter } ) );

   beforeEach( function() {
      metaEvents = specData.metaEvents;
      metaEvents2 = specData.metaEvents2;

      axMocks.widget.configure( {
         events: {
            stream: 'myEventStream',
            bufferSize: bufferSize
         }
      } );
   } );

   beforeEach( axMocks.widget.load );
   beforeEach( () => {
      widgetDom = axMocks.widget.render();
   } );
   beforeEach( function() {
      axMocks.eventBus.publish( 'didProduce.myEventStream', { data: metaEvents } );
      axMocks.eventBus.flush();
   } );

   afterEach( axMocks.tearDown );

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'to display event items (events)', function() {

      it( 'subscribes to the configured meta-event, to obtain event items (R1.1)', function() {
         expect( axMocks.widget.axContext.eventBus.subscribe ).toHaveBeenCalledWith(
            'didProduce.myEventStream',
            jasmine.any( Function )
         );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'represents each event item if not filtered out (R1.2)', function() {
         expect( widgetDom.querySelectorAll( '.ax-event-summary' ).length ).toEqual( 5 );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'maintains a buffer of limited size (R1.3)', function() {
         axMocks.eventBus.publish( 'didProduce.myEventStream', { data: metaEvents2 } );
         axMocks.eventBus.flush();
         const filtered = 2;
         expect( widgetDom.querySelectorAll( '.ax-event-summary' ).length ).toEqual( bufferSize - filtered );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'offers the user to clear the buffer manually, removing all event rows from view (R1.4)', function() {
         expect( widgetDom.querySelectorAll( '.ax-event-summary' ).length ).not.toEqual( 0 );
         widgetDom.querySelector( '.ax-discard-events' ).click();
         expect( widgetDom.querySelectorAll( '.ax-event-summary' ).length ).toEqual( 0 );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'allows for the user to select events rows, resulting in a highlighted representation (R1.5)', function() {
         expect( widgetDom.querySelector( '.ax-event-body' ).classList.contains( 'ax-event-selected' ) ).toBe( false );
         widgetDom.querySelectorAll( '.ax-event-body' )[ 0 ].click();
         expect( widgetDom.querySelector( '.ax-event-body' ).classList.contains( 'ax-event-selected' ) ).toBe( true );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////
/*
      describe( 'When a row with interaction type _publish_ or _subscribe_ is highlighted', function() {

         beforeEach( function() {
 console.log( widgetDom );
            axMocks.widget.$scope.model.settings.sources.runtime = true;
            axMocks.widget.$scope.$digest();
            // select publish for takeActionRequest.doStuff
            axMocks.widget.$scope.commands.select( axMocks.widget.$scope.model.visibleEventInfos[ 1 ] );
         } );

         //////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'highlights _related_ rows as well (R1.6)', function() {
            var selected = axMocks.widget.$scope.model.visibleEventInfos.map( function( _ ) { return _.selected; } );
            // expect publish/deliver for takeActionRequest.doStuff
            expect( selected ).toEqual( [ true, true, false, true, false ] );
         } );

      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'allows for the user to impose a _limit_ on the number of most recent events to display (R1.7)', function() {
         axMocks.widget.$scope.model.settings.visibleEventsLimit = 2;
         axMocks.widget.$scope.$digest();

         expect( axMocks.widget.$scope.model.visibleEventInfos.length ).toEqual( 2 );
      } );
*/
   } ) } );

   ////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
   describe( 'to filter event items (filters)', function() {

      it( 'offers to filter events _by name_, using regular expressions (R2.1)', function() {
         axMocks.widget.$scope.model.settings.interactions.subscribe = true;

         // select didNavigate, but not didNavigate.here
         axMocks.widget.$scope.model.settings.namePattern = 'did[^.]+$';
         axMocks.widget.$scope.$digest();

         expect( axMocks.widget.$scope.model.visibleEventInfos.length ).toEqual( 1 );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'offers to filter events _by pattern_, using a group of toggle controls (R2.2)', function() {
         axMocks.widget.$scope.model.settings.sources.runtime = true;
         axMocks.widget.$scope.model.settings.interactions.subscribe = true;
         axMocks.widget.$scope.model.settings.interactions.unsubscribe = true;

         axMocks.widget.$scope.model.settings.patterns.actions = false;
         axMocks.widget.$scope.$digest();

         expect( axMocks.widget.$scope.model.visibleEventInfos.length ).toEqual( 3 );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'offers to filter events _by interaction type_, using a group of toggle controls (R2.3)', function() {
         axMocks.widget.$scope.model.settings.sources.runtime = true;

         axMocks.widget.$scope.model.settings.interactions.subscribe = true;
         axMocks.widget.$scope.model.settings.interactions.unsubscribe = true;
         axMocks.widget.$scope.model.settings.interactions.publish = false;
         axMocks.widget.$scope.model.settings.interactions.deliver = false;
         axMocks.widget.$scope.$digest();

         expect( axMocks.widget.$scope.model.visibleEventInfos.length ).toEqual( 4 );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'offers to filter events _by source type_, using a group of toggle controls (R2.4)', function() {
         axMocks.widget.$scope.model.settings.interactions.subscribe = true;
         axMocks.widget.$scope.model.settings.interactions.unsubscribe = true;

         axMocks.widget.$scope.model.settings.sources.widgets = false;
         axMocks.widget.$scope.model.settings.sources.runtime = true;
         axMocks.widget.$scope.$digest();

         expect( axMocks.widget.$scope.model.visibleEventInfos.length ).toEqual( 2 );
      } );

   } );
*/
