/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://www.laxarjs.org
 */
define( [
   'laxar',
   'laxar-patterns',
   'angular',
   'require'
], function( ax, patterns, ng, require ) {
   'use strict';

   var BUFFER_SIZE = 500;

   // To capture navigation and lifecycle events, the event log persists across LaxarJS navigation.
   var contentWindow;
   var cleanupInspector;


   var developerHooks;
   var buffers;
   var enabled;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope', 'axEventBus' ];

   function Controller( $scope, eventBus ) {
      $scope.enabled = enabled;
      if( !$scope.enabled ) {
         return;
      }

      $scope.commands = {
         open: openContentWindow
      };

      var contentUrl = require.toUrl( './content/' ) +
         ( $scope.features.develop.enabled ? 'debug' : 'index' ) + '.html';

      $scope.features.open.onActions.forEach( function( action ) {
         eventBus.subscribe( 'takeActionRequest.' + action, function( event ) {
            openContentWindow();
            eventBus.publish( 'didTakeAction.' + event.action, { action: event.action } );
         } );
      } );

      if( $scope.features.open.onGlobalMethod ) {
         window[ $scope.features.open.onGlobalMethod ] = openContentWindow;
      }

      developerHooks.tracker = topicTracker();
      if( $scope.features.grid ) {
         developerHooks.gridSettings = $scope.features.grid;
      }

      $scope.$on( '$destroy', cleanup );


      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function cleanup() {
         if( $scope.features.open.onGlobalMethod ) {
            delete window[ $scope.features.open.onGlobalMethod ];
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function openContentWindow() {
         var settings = {
            resizable: 'yes',
            scrollbars: 'yes',
            status: 'yes',
            width: 1280,
            height: 700
         };

         var settingsString = Object.keys( settings ).map( function( key ) {
            return key + '=' + settings[ key ];
         } ).join( ',' );

         if( !contentWindow || contentWindow.closed ) {
            contentWindow = window.open( contentUrl, 'axDeveloperTools', settingsString );
         }

         try {
            contentWindow.focus();
         }
         catch( e ) {
            ax.log.warn(
               'AxDeveloperToolsWidget: Popup was blocked. Unblock in browser, or use the "button" feature.'
            );
         }
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function startCapturingEvents( eventBus ) {
      enabled = ax.configuration.get( 'widgets.laxar-developer-tools-widget.enabled', true );

      if( enabled ) {
         developerHooks = window.axDeveloperTools = ( window.axDeveloperTools || {} );
         buffers = developerHooks.buffers = ( developerHooks.buffers || { events: [], log: [] } );

         ax.log.addLogChannel( logChannel );
         cleanupInspector = eventBus.addInspector( function( eventItem ) {
            var problems = developerHooks.tracker ? developerHooks.tracker.track( eventItem ) : [];
            problems.forEach( function( problem ) {
               ax.log.warn( 'DeveloperTools: [0], event: [1]', problem.description, eventItem );
            } );
            pushIntoStore(
               'events',
               ax.object.options( {
                  time: new Date(),
                  problems: problems
               }, eventItem )
            );
         } );
         ng.element( window ).off( 'beforeunload.AxDeveloperToolsWidget' );
         ng.element( window ).on( 'beforeunload.AxDeveloperToolsWidget', function() {
            ax.log.removeLogChannel( logChannel );
            cleanupInspector();
            cleanupInspector = null;
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function logChannel( messageObject ) {
         pushIntoStore( 'log', messageObject );
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function topicTracker() {
      var ACTION = 'action';
      var FLAG = 'flag';
      var RESOURCE = 'resource';
      var ERROR = 'error';

      var OTHER = 'other';

      var types = {
         takeActionRequest: ACTION,
         willTakeAction: ACTION,
         didTakeAction: ACTION,

         didChangeFlag: FLAG,

         didReplace: RESOURCE,
         didUpdate: RESOURCE,
         validateRequest: RESOURCE,
         willValidate: RESOURCE,
         didValidate: RESOURCE,
         saveRequest: RESOURCE,
         willSave: RESOURCE,
         didSave: RESOURCE,

         didEncounterError: ERROR
      };

      var resourceState = {};
      var flagState = {};
      var actionState = {};

      return {
         state: function() {
            return ax.object.deepClone( {
               resources: resourceState,
               flags: flagState,
               actions: actionState
            } );
         },
         track: function( eventItem ) {
            if( eventItem.action !== 'publish' ) {
               return [];
            }

            var topics = eventItem.event.split( '.' );
            var subject = eventItem.source;
            var verb = topics[ 0 ];
            var object = topics[ 1 ];
            var payload = eventItem.eventObject;

            if( !object ) {
               return [ {
                  description: 'Event seems to have an invalid name: The second topic is missing!'
               } ];
            }

            var type = types[ verb ] || OTHER;
            if( type === RESOURCE ) {
               return trackResourceEvent( payload, subject, verb, object );
            }
            if( type === ACTION ) {
               return trackActionEvent( payload, subject, verb, object );
            }

            return [];
         }
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function trackActionEvent( payload, subject, verb, actionName ) {
         var state;
         var problems = [];
         if( !payload.action ) {
            problems.push( { description: 'Event is missing "action" field in payload.' } );
         }

         state = actionState[ actionName ] = actionState[ actionName ] || {
            state: 'inactive',
            numRequests: 0,
            requester: subject,
            requestedBy: null,
            outstandingReplies: {}
         };

         if( verb === 'takeActionRequest' ) {
            if( state.state === 'active' ) {
               problems.push( { description: ax.string.format(
                  'Published takeActionRequest, but action already requested by "[0]"',
                  [ state.requestedBy ]
               ) } );
            }
            state.state = 'active';
            ++state.numRequests;
            return problems;
         }

         if( verb === 'willTakeAction' ) {
            if( state.state === 'inactive' ) {
               problems.push( { description: 'willTakeAction published with no active request' } );
            }
            if( state.outstandingReplies[ subject ] ) {
                problems.push( { description: 'willTakeAction published twice by the same respondent' } );
            }
            state.outstandingReplies[ subject ] = true;
            return problems;
         }

         if( verb === 'didTakeAction' ) {
            if( state.state === 'inactive' ) {
               problems.push( { description: 'didTakeAction published with no active request' } );
            }
            if( !state.outstandingReplies[ subject ] ) {
               // This is o.k., for example while finishing up navigation!
               problems.push( { description: 'didTakeAction published without willTakeAction' } );
            }
            delete state.outstandingReplies[ subject ];
            if( Object.keys( state.outstandingReplies).length === 0 ) {
               state.state = 'inactive';
            }
            return problems;
         }

         return problems;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function trackFlagEvent() {
         return [];
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function trackResourceEvent( payload, subject, verb, resourceName ) {
         var state;
         var problems = [];
         if( !payload.resource ) {
            problems.push( { description: 'Event is missing "resource" field in payload.' } );
         }

         if( verb === 'didReplace' ) {
            if (payload.data === undefined) {
               problems.push( { description: 'didReplace event-payload is missing "data" field.' } );
            }
            state = resourceState[ resourceName ] = resourceState[ resourceName ] || {
               state: 'replaced',
               master: subject,
               lastModificationBy: null,
               value: null
            };
            if( state.master !== subject ) {
               problems.push( {
                  description: ax.string.format(
                     'master/master conflict: for resource `[0]` (first master: [1], second master: [2])"',
                     [ resourceName, state.master, subject ]
                  )
               } );
            }
            state.lastModificationBy = subject;
            state.value = payload.data;
            return problems;
         }

         if( verb === 'didUpdate' ) {
            state = resourceState[ resourceName ];
            if( !state ) {
               problems.push( {
                  description: 'Sender "' + subject + '" published didUpdate without prior didReplace.'
               } );
            }
            if( state.value === null || state.value === undefined ) {
               problems.push( {
                  description: 'Sender "' + subject + '" published didUpdate, but resource is ' + state.value
               } );
            }
            if( !event.patches ) {
               problems.push( {
                  description: 'Sender "' + subject + '" published didUpdate without patches field.'
               } );
            }

            if( problems.length ) {
               return;
            }

            state.lastModificationBy = subject;
            try {
               patterns.json.applyPatch( state.value, payload.patches );
            }
            catch( error ) {
               problems.push( {
                  description: 'Failed to apply patch sequence in didUpdate from "' + subject + '"'
               } );
            }
            return problems;
         }
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function pushIntoStore( storeName, item ) {
      var buffer = buffers[ storeName ];
      while( buffer.length >= BUFFER_SIZE ) {
         buffer.shift();
      }
      buffer.push( item );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return ng.module( 'axDeveloperToolsWidget', [] )
       .run( [ 'axGlobalEventBus', startCapturingEvents ] )
       .controller( 'AxDeveloperToolsWidgetController', Controller );

} );
