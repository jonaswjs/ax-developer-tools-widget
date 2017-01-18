/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

/* global chrome */

define( [], function() {
   'use strict';

   const REFRESH_DELAY_MS = 100;

   //Security wrapper denied access to property "buffers" on privileged Javascript object.
   //Support for exposing privileged objects to untrusted content via __exposedProps__ is being
   //gradually removed - use WebIDL bindings or Components.utils.cloneInto instead.
   // Note that only the first denied property access from a given global object will be reported.
   const injections = [ 'axContext', 'axEventBus' ];
   const controller = function( context, eventBus ) {
      let pageInfoVersion = -1;
      let timeout;
      const lastIndexByStream = {};
      let isLaxarApplication;
      const isBrowserWebExtension = ( window.chrome && chrome.runtime && chrome.runtime.id );
      // If the development server is used and we don't want the development window to be reloaded each
      // time something changes during development, we shutdown live reload here.
      if( window.LiveReload && !context.features.development.liveReload ) {
         window.LiveReload.shutDown();
      }

      eventBus.subscribe( 'endLifecycleRequest', function() {
         if( timeout ) {
            window.clearTimeout( timeout );
         }
      } );

      if( window.opener ) {
         eventBus.subscribe( 'beginLifecycleRequest', function() {
            publishLaxarApplicationFlag( true );
            tryPublishData();
         } );
      }
      else {
         eventBus.subscribe( 'beginLifecycleRequest', function() {
            publishLaxarApplicationFlag( false );
            window.addEventListener( 'message', extensionEventListener );
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function extensionEventListener( event ) {
         const channel = JSON.parse( event.detail || event.data );
         if( channel.text === 'noLaxarDeveloperToolsApi' ) {
            publishLaxarApplicationFlag( false );
            return;
         }
         const channelGridSettings = channel && channel.gridSettings;
         if( context.features.grid.resource ) {
            publishGridSettings( channelGridSettings );
         }
         if( channel && channel.pageInfoVersion > pageInfoVersion ) {
            publishAndSetPageInfoVersion( channel.pageInfo, channel.pageInfoVersion );
         }
         const buffers = channel && channel.buffers;
         if( buffers ) {
            publishStream( 'events', buffers );
            publishStream( 'log', buffers );
            publishLaxarApplicationFlag( true );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function tryPublishData() {
         try {
            const channel = window.opener.axDeveloperTools;
            publishDataOrHandleException( channel, false );
         }
         catch( exception ) {
            publishDataOrHandleException( undefined, true );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishDataOrHandleException( channel, isException ) {
         if( isException ) {
            publishLaxarApplicationFlag( false );
         }
         else {
            const channelGridSettings = channel && channel.gridSettings;
            if( context.features.grid.resource ) {
               publishGridSettings( channelGridSettings );
            }
            publishLaxarApplicationFlag( true );
            checkForData();
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishGridSettings( channelGridSettings ) {
         if( !channelGridSettings ) {
            channelGridSettings = null;
         }
         eventBus.publish( 'didReplace.' + context.features.grid.resource, {
            resource: context.features.grid.resource,
            data: channelGridSettings
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function checkForData() {
         try {
            const channel = window.opener.axDeveloperTools;
            checkForDataOrHandleException( channel, false );
         }
         catch( e ) {
            checkForDataOrHandleException( undefined, true );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function checkForDataOrHandleException( channel, isException ) {
         if( isException ) {
            publishLaxarApplicationFlag( false );
         }
         else {
            const buffers = channel && channel.buffers;
            if( buffers ) {
               publishStream( 'events', buffers );
               publishStream( 'log', buffers );
            }
            if( channel && channel.pageInfoVersion > pageInfoVersion ) {
               publishAndSetPageInfoVersion( channel.pageInfo, channel.pageInfoVersion );
            }
            publishLaxarApplicationFlag( true );
            timeout = window.setTimeout( checkForData, REFRESH_DELAY_MS );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishAndSetPageInfoVersion( pageInfo, version ) {
         pageInfoVersion = version;
         eventBus.publish( 'didReplace.' + context.features.pageInfo.resource, {
            resource: context.features.pageInfo.resource,
            data: pageInfo
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishStream( bufferFeature, buffers ) {
         const buffer = buffers[bufferFeature];
         const lastIndex = lastIndexByStream[bufferFeature] || -1;
         const events = buffer
            .filter( function( _ ) { return lastIndex < _.index; } )
            .map( function( _ ) { return JSON.parse( _.json ); } );
         if( !events.length ) {
            return;
         }
         eventBus.publish( 'didProduce.' + context.features[bufferFeature].stream, {
            stream: context.features[bufferFeature].stream,
            data: events
         } );
         lastIndexByStream[bufferFeature] = buffer[buffer.length - 1].index;
         navigation( events );
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      function navigation( events ) {
         events.forEach( function( event ) {
            if( event.action === 'publish' && event.event.substr( 0, 11 ) === 'didNavigate' ) {
               eventBus.publish( 'takeActionRequest.navigation', {
                  action: 'navigation'
               } );
            }
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishLaxarApplicationFlag( state ) {
         if( isLaxarApplication !== state ) {
            eventBus.publish( 'didChangeFlag.' + context.features.laxarApplication.flag + '.' + state, {
               flag: context.features.laxarApplication.flag,
               state: state
            } );
            isLaxarApplication = state;
            if( isBrowserWebExtension ) {
               chrome.runtime.sendMessage( {
                  active: state,
                  id: chrome.devtools.inspectedWindow.tabId
               } );
            }
         }
      }
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      name: 'host-connector-widget',
      injections,
      create: controller
   };

} );
