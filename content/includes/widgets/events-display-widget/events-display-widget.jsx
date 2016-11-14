/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import React from 'react';
import patterns from 'laxar-patterns';
import moment from 'moment';
import ng from 'angular';
import tracker from './tracker';


function create( context, reactRender, flowService ) {
   'use strict';

   var settingGroups = [ 'patterns', 'interactions', 'sources' ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   context.resources = {};

   var resourceHandler = patterns.resources.handlerFor( context ).registerResourceFromFeature( 'filter', {
      onUpdateReplace: runFilters,
      isOptional: true
   } );

   var model = {
      patterns: [
         { name: 'lifecycle', htmlIcon: '<i class="fa fa-recycle"></i>', eventTypes: [
            'endLifecycle', 'beginLifecycle'
         ] },
         { name: 'navigation', htmlIcon: '<i class="fa fa-location-arrow"></i>', eventTypes: [
            'navigate'
         ] },
         { name: 'resources', htmlIcon: '<i class="fa fa-file-text-o"></i>', eventTypes: [
            'replace', 'update', 'validate', 'save'
         ] },
         { name: 'actions', htmlIcon: '<i class="fa fa-rocket"></i>', eventTypes: [
            'takeAction'
         ] },
         { name: 'flags', htmlIcon: '<i class="fa fa-flag"></i>', eventTypes: [
            'changeFlag'
         ] },
         { name: 'i18n', htmlIcon: '<i class="fa fa-globe"></i>', eventTypes: [
            'changeLocale'
         ] },
         { name: 'visibility', htmlIcon: '<i class="fa fa-eye"></i>', eventTypes: [
            'changeAreaVisibility', 'changeWidgetVisibility'
         ] },
         { name: 'other', htmlIcon: '&nbsp;', eventTypes: [] }
      ],
      index: 0,
      eventInfos: [],
      visibleEventInfos: [],
      problemSummary: {
         count: 0,
         eventInfos: []
      },
      selectionEventInfo: null,
      settings: {
         namePattern: '',
         visibleEventsLimit: 100,
         patterns: {},
         interactions: {
            subscribe: true,
            publish: true,
            deliver: true,
            unsubscribe: true
         },
         sources: {
            widgets: true,
            runtime: true
         }
      }
   };

   context.view = {
      showPatterns: false,
      patternsByName: ( function() {
         var result = {};
         context.model.patterns.forEach( function( pattern ) {
            result[ pattern.name ] = pattern;
         } );
         return result;
      } )()
   };

   var commands = {
      setAll: function( toValue ) {
         settingGroups.forEach( function( groupName ) {
            var group = context.model.settings[ groupName ];
            ng.forEach( group, function( _, name ) {
               group[ name ] = toValue;
            } );
         } );
      },
      setDefaults: function() {
         settingGroups.forEach( function( groupName ) {
            var group = context.model.settings[ groupName ];
            ng.forEach( group, function( _, name ) {
               group[ name ] = true;
            } );
         } );
         context.model.patterns.forEach( function( patternInfo ) {
            context.model.settings.patterns[ patternInfo.name ] = true;
         } );
         context.features.filter.hidePatterns.forEach( function( pattern ) {
            context.model.settings.patterns[ pattern ] = false;
         } );
         context.features.filter.hideSources.forEach( function( pattern ) {
            context.model.settings.sources[ pattern ] = false;
         } );
         context.features.filter.hideInteractions.forEach( function( pattern ) {
            context.model.settings.interactions[ pattern ] = false;
         } );
      },
      clearFilters: function() {
         context.model.settings.namePattern = '';
         context.model.settings.visibleEventsLimit = null;
         context.commands.setAll( true );
      },
      select: function( eventInfo ) {
         context.model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
         runFilters();
      },
      discard: function() {
         context.model.eventInfos = [];
         context.model.selectionEventInfo = null;
         runFilters();
         refreshProblemSummary();
      },
      runFilters: runFilters
   };

   context.commands.setDefaults();

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   if( context.features.events.stream ) {
      context.eventBus.subscribe( 'didProduce.' + context.features.events.stream, function( event ) {
         if( Array.isArray( event.data ) && event.data.length ) {
            event.data.forEach( addEvent );
         }
         else {
            addEvent( event.data );
         }
         runFilters();
      } );
   }

   context.$watch( 'model.settings', runFilters, true );

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function addEvent( eventInfo ) {

      var completeEventInfo = {
         index: ++context.model.index,
         interaction: eventInfo.action,
         cycleId: eventInfo.cycleId > -1 ? eventInfo.cycleId : '-',
         eventObject: eventInfo.eventObject || {},
         formattedEvent: JSON.stringify( eventInfo.eventObject, null, 3 ),
         formattedTime: {
            upper: moment( eventInfo.time ).format( 'HH:mm' ),
            lower: moment( eventInfo.time ).format( 'ss.SSS' )
         },
         name: eventInfo.event || '?',
         pattern: pattern( (eventInfo.event || '?').toLowerCase() ),
         showDetails: false,
         source: ( eventInfo.source || '?' ).replace( /^widget\./, '' ),
         target: ( eventInfo.target || '?' ).replace( /^-$/, '' ),
         time: eventInfo.time,
         selected: false,
         sourceType: ( eventInfo.source || '?' ).indexOf( 'widget.' ) === 0 ? 'widgets' : 'runtime',
         problems: tracker.track( eventInfo )
      };

      context.model.eventInfos.unshift( completeEventInfo );
      if( completeEventInfo.problems.length ) {
         refreshProblemSummary();
      }

      if( context.model.eventInfos.length > context.features.events.bufferSize ) {
         var removedInfo = context.model.eventInfos.pop();
         if( removedInfo.problems.length ) {
            refreshProblemSummary();
         }
      }

      function pattern( eventName ) {
         var matchingPatthern = context.model.patterns.filter( function( pattern ) {
            return pattern.eventTypes.some( function( eventType ) {
               return eventName.indexOf( eventType.toLowerCase() ) !== -1;
            } );
         } );
         return matchingPatthern.length ? matchingPatthern[ 0 ].name : 'other';
      }

   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function refreshProblemSummary() {
      var eventInfos = context.model.eventInfos.filter( function( info ) {
         return info.problems.length > 0;
      } );

      context.model.problemSummary = {
         hasProblems: eventInfos.length > 0,
         eventInfos: eventInfos
      };
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function runFilters() {
      var settings = context.model.settings;
      var numVisible = 0;

      var searchRegExp = null;
      if( settings.namePattern ) {
         try {
            searchRegExp = new RegExp( settings.namePattern, 'gi' );
         }
         catch( e ) { /* ignore invalid search pattern */ }
      }
      var selectionEventInfo = context.model.selectionEventInfo;

      context.model.visibleEventInfos = context.model.eventInfos.filter( function( eventInfo ) {
         if( settings.visibleEventsLimit !== null && numVisible >= settings.visibleEventsLimit ) {
            return false;
         }
         if( !settings.interactions[ eventInfo.interaction ] ) {
            return false;
         }
         if( !settings.patterns[ eventInfo.pattern ] ) {
            return false;
         }
         if( !settings.sources[ eventInfo.sourceType ] ) {
            return false;
         }
         if( !matchesFilterResource( eventInfo ) ) {
            return false;
         }
         if( !matchesSearchExpression( eventInfo, searchRegExp ) ) {
            return false;
         }
         ++numVisible;
         return true;
      } );

      // modify matches in place
      context.model.visibleEventInfos.forEach( function( eventInfo ) {
         eventInfo.htmlName = htmlValue( eventInfo.name, searchRegExp, '.' );
         eventInfo.htmlSource = htmlValue( eventInfo.source, searchRegExp, '#' );
         eventInfo.htmlTarget = htmlValue( eventInfo.target, searchRegExp, '#' );
         eventInfo.selected = !!selectionEventInfo && inSelection( eventInfo, selectionEventInfo );
      } );
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function matchesSearchExpression( eventInfo, searchRegExp ) {
      return !searchRegExp || [ eventInfo.name, eventInfo.source, eventInfo.target ]
         .some( function( field ) {
            var matches = searchRegExp.test( field );
            searchRegExp.lastIndex = 0;
            return !!matches;
         } );
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   var patternTopics = {
      RESOURCE: [ 'didReplace', 'didUpdate' ],
      ACTION: [ 'takeActionRequest', 'willTakeAction', 'didTakeAction' ],
      FLAG: [ 'didChangeFlag' ],
      CONTAINER: [ 'changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility' ]
   };

   function matchesFilterResource( eventInfo ) {
      if( !context.resources.filter ) {
         return true;
      }

      var filterTopics = context.resources.filter.topics || [];
      var filterParticipants = context.resources.filter.participants || [];
      if( !filterTopics.length && !filterParticipants.length ) {
         return true;
      }

      var matchesTopicFilter = filterTopics
         .some( function( item ) {
            var prefixes = patternTopics[ item.pattern ];
            return prefixes.some( function( prefix ) {
               var topic = prefix + '.' + item.topic;
               return eventInfo.name === topic || eventInfo.name.indexOf( topic + '.' ) === 0;
            } );
         } );

      var matchesParticipantsFilter = [ 'target', 'source' ].some( function( field ) {
         var value = eventInfo[ field ];
         return filterParticipants
            .map( function( _ ) { return _.participant; } )
            .some( isSuffixOf( value ) );
      } );

      return matchesTopicFilter || matchesParticipantsFilter;

      function isSuffixOf( value ) {
         return function( _ ) {
            var tail = '#' + _;
            return value.length >= tail.length && value.indexOf( tail ) === value.length - tail.length;
         };
      }
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function htmlValue( value, searchRegExp, splitCharacter ) {
      var html = $sanitize( value );
      var wasSplit = false;
      if( !searchRegExp ) {
         return wrap( split( html, false ) );
      }

      var parts = [];
      var match;
      var lastIndex = 0;
      var limit = 1;
      while( limit-- && ( match = searchRegExp.exec( html ) ) !== null ) {
         if( match.index > lastIndex ) {
            parts.push( split( html.substring( lastIndex, match.index ), false ) );
         }
         parts.push( '<b>' );
         parts.push( split( match[ 0 ], true ) );
         parts.push( '</b>' );
         lastIndex = searchRegExp.lastIndex;
      }
      searchRegExp.lastIndex = 0;
      parts.push( split( html.substring( lastIndex, html.length ) ) );
      return wrap( parts.join( '' ) );

      function wrap( whole ) {
         return '<span>' + whole + '</span>';
      }

      function split( part, isBold ) {
         if( !splitCharacter || wasSplit ) {
            return part;
         }

         var splitPoint = part.indexOf( splitCharacter );
         if( splitPoint === -1 ) {
            return part;
         }

         wasSplit = true;
         return part.substring( 0, splitPoint ) +
            ( isBold ? '</b>' : '' ) + '</span><br /><span>' + ( isBold ? '<b>' : '' ) +
            part.substring( splitPoint + 1, part.length );
      }
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function inSelection( eventInfo, selectionEventInfo ) {
      if( !selectionEventInfo ) {
         return false;
      }

      return eventInfo === selectionEventInfo || (
         eventInfo.cycleId === selectionEventInfo.cycleId &&
         eventInfo.source === selectionEventInfo.source &&
         eventInfo.name === selectionEventInfo.name
      );
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function separate( label, separator, defaultText ) {
      var name = label || defaultText;
      var splitPoint = name.indexOf( separator );
      return {
         upper: splitPoint === -1 ? name : name.substr( 0, splitPoint ),
         lower: splitPoint === -1 ? defaultText : name.substr( splitPoint, name.length )
      };
   }

   function render() {


      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function affix() {

         const eventInfoList = model.problemSummary.eventInfos.map( ( event ) => {
            return (
               <li key={event.name} >
                 <h5><strong>{ event.name }</strong> <em>(source: { event.source })</em></h5>
                 <ul>
                    {
                       event.problems.map( ( problems ) => {
                          return (
                             <li key={problem.description}
                              className="ax-event-problem">
                             <i className="fa fa-warning ax-error"></i> { problem.description }
                             </li>
                          );
                       } )
                    }
                 </ul>
             </li>
            )
         } );

         return (
            <div className="ax-affix-area"
                 ax-affix
                 ax-affix-offset-top="100">
                  { !model.eventInfos.length &&
                    <div className="text-large">
                       <h4 className="text-primary">Empty Events List</h4>
                       <p><i className="fa fa-clock-o"></i> Waiting for events from host application...</p>
                    </div>
                  }
                  { model.eventInfos.length && !model.visibleEventInfos.length &&
                    <div className="text-large">
                       <h4 className="text-primary">0/{ model.eventInfos.length } Event Items</h4>
                       <p>No events matching current filters.</p>
                       <p><button type="button"
                                 className="btn btn-sm btn-primary"
                                 onClick="commands.clearFilters">Show All</button></p>
                    </div>
                  }

                  { model.problemSummary.hasProblems &&
                     <div className="text-large">
                        <h4 className="text-primary ax-error">{ model.problemSummary.eventInfos.length }/{ model.eventInfos.length } Events with Problems</h4>
                        <ul>{eventInfoList}</ul>
                       <p className="ax-event-problems-explanation">
                          Events with problems are marked <strong className="ax-error">red</strong> in the events table.
                          Filter by event/source as needed.
                       </p>
                    </div>
                  }





                 <div ng-if="model.visibleEventInfos.length"
                      className="text-large">
                    <h4 className="text-primary">{{ model.visibleEventInfos.length }}/{{ model.eventInfos.length }} Events</h4>
                 </div>

               <div className="ax-button-wrapper form-inline">

                  <div className="form-group form-group-sm">
                     <label ax-for="'search'"><small>Filters:</small></label>
                     <input className="form-control input-sm"
                            placeholder="Search (RegExp)"
                            ax-id="'search'"
                            ng-model="model.settings.namePattern">

                     <label ax-for="'limit'"><small>Limit:</small></label>
                     <input className="form-control input-sm"
                            ax-id="'limit'"
                            ng-model="model.settings.visibleEventsLimit"
                            ng-model-options="{ updateOn: 'default' }"
                            ax-input="integer"
                            ax-input-minimum-value="0"
                            ax-input-maximum-value="features.events.bufferSize"
                            placeholder="0-{{ features.events.bufferSize }}"
                            maxlength="4">
                  </div>

                  <!-- Filters menu -->
                  <div className="btn-group btn-group-sm"
                       ng-className="{ 'open': view.showPatterns }"
                       ng-mouseenter="view.showPatterns = true"
                       ng-mouseleave="view.showPatterns = false">
                     <button type="button"
                             className="btn btn-default dropdown-toggle"
                             data-toggle="dropdown"
                             aria-expanded="{{ view.showPatterns }}">
                        More <span className="caret"></span>
                     </button>
                     <div className="dropdown-menu container col-lg-6" role="menu">

                        <div className="row">
                           <div className="ax-event-settings-col first">
                              <h4>Patterns</h4>
                              <div ng-repeat="pattern in model.patterns track by pattern.name">
                                 <button
                                    type="button"
                                    className="btn btn-link ax-event-setting-toggle"
                                    ng-click="model.settings.patterns[ pattern.name ] = !model.settings.patterns[ pattern.name ]">
                                    <span className="ax-event-pattern" ng-bind-html="pattern.htmlIcon"></span>
                                    {{ pattern.name }}
                                    <i className="fa pull-right ax-event-setting-toggle"
                                       ng-class="{ 'fa-toggle-off': !model.settings.patterns[ pattern.name ], 'fa-toggle-on': model.settings.patterns[ pattern.name ] }"></i>
                                 </button>
                              </div>
                           </div>

                           <div className="ax-event-settings-col last">
                              <h4>Interactions</h4>
                              <div ng-repeat="(interaction, enabled) in model.settings.interactions track by interaction">
                                 <button
                                    type="button"
                                    className="btn btn-link ax-event-setting-toggle"
                                    ng-click="model.settings.interactions[ interaction ] = !enabled"
                                    >{{ interaction }}<i className="fa pull-right ax-event-setting-toggle"
                                                    ng-className="{ 'fa-toggle-off': !enabled, 'fa-toggle-on': enabled }"></i>
                                 </button>
                              </div>

                              <br>
                              <h4>Sources</h4>
                              <div ng-repeat="(source, enabled) in model.settings.sources track by source">
                                 <button
                                    type="button"
                                    className="btn btn-link ax-event-setting-toggle"
                                    ng-click="model.settings.sources[ source ] = !enabled"
                                    >{{ source }}<i className="fa pull-right ax-event-setting-toggle"
                                                    ng-class="{ 'fa-toggle-off': !enabled, 'fa-toggle-on': enabled }"></i>
                                 </button>
                              </div>
                           </div>

                        </div>

                        <div className="row">
                           <div className="ax-event-settings-col first">&nbsp;</div>
                           <div className="ax-event-settings-col last">
                              <div className="pull-right">
                                 <button type="button" className="btn btn-xs btn-primary" ng-click="commands.setAll( true )">All On</button>
                                 <button type="button" className="btn btn-xs btn-primary" ng-click="commands.setAll( false )">All Off</button>
                                 <button type="button" className="btn btn-xs" ng-click="commands.setDefaults()">Defaults</button>
                              </div>
                           </div>
                        </div>

                     </div>
                  </div>

                  <button className="btn btn-primary btn-sm"
                          type="button"
                          ng-class="{ 'ax-disabled': !model.eventInfos.length }"
                          ng-click="commands.discard()">Discard Events</button>
               </div>

               <div className="form-inline events-display-filter-items" ng-if="resources.filter.topics.length || resources.filter.participants.length">
                  <a className="btn btn-xs btn-link" href="#/tools/page">Page selection</a>
                  <span className="btn btn-xs btn-info"
                        ng-repeat="item in resources.filter.topics track by item.topic"
                        ng-className="'ax-events-display-pattern-' + item.pattern">
                        {{item.topic}}
                  </span><span className="btn btn-xs btn-info"
                        ng-repeat="item in resources.filter.participants track by item.participant"
                        ng-className="'ax-events-display-kind-' + item.kind">
                        {{item.participant}}
                  </span>
               </div>
            </div>
         )
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function eventListTable() {
         return (
            <table ng-if="model.visibleEventInfos.length"
                   className="table">
               <colgroup>
                  <col className="ax-col-pattern-icon">
                  <col className="ax-col-interaction">
                  <col className="ax-col-payload-icon">
                  <col className="ax-col-name">

                  <col className="ax-col-source">
                  <col className="ax-col-target">
                  <col className="ax-col-cycle">
                  <col className="ax-col-timestamp">
               </colgroup>
               <thead>
                  <tr>
                     <th>&nbsp;</th>
                     <th>Action</th>
                     <th>&nbsp;</th>
                     <th>Event Name</th>

                     <th>Source</th>
                     <th>Target</th>
                     <th className="text-right">Cycle</th>
                     <th className="text-right">Time<i className="fa fa-long-arrow-up"></i></th>
                  </tr>
               </thead>
               <tbody ng-repeat="event in model.visibleEventInfos"
                      ng-className="'ax-event-pattern-' + event.pattern +
                                ' ax-event-interaction-' + event.interaction +
                                ( event.selected ? ' ax-event-selected' : '' ) +
                                ( event.problems.length ? ' ax-event-has-problems' : '' )"
                      ng-click="commands.select( event )">
                  <tr className="ax-event-summary">
                     <td className="ax-col-pattern-icon"
                         title="{{ event.pattern }}"
                         ng-bind-html="view.patternsByName[ event.pattern ].htmlIcon"></td>
                     <td className="ax-col-interaction">{{event.interaction}}</td>
                     <td className="ax-col-payload-icon">
                        <button type="button" className="btn-link btn-info"
                                ng-if="event.interaction == 'publish' && !event.showDetails"
                                ng-click="event.showDetails = true; $event.stopPropagation();"><i className="fa fa-plus-square">&nbsp;</i></button>
                        <button type="button" className="btn-link btn-info"
                                ng-if="event.interaction == 'publish' && event.showDetails"
                                ng-click="event.showDetails = false; $event.stopPropagation();"><i className="fa fa-minus-square" >&nbsp;</i></button>
                     </td>
                     <td ng-bind-html="event.htmlName"></td>
                     <td ng-bind-html="event.htmlSource"></td>
                     <td ng-bind-html="event.htmlTarget"></td>
                     <td className="ax-col-cycle text-right">{{event.cycleId}}</td>
                     <td className="text-right"><span>{{event.formattedTime.upper}}</span><br /><span>{{event.formattedTime.lower}}</span></td>
                  </tr>
                  <tr className="ax-event-payload"
                      ng-if="event.problems.length">
                     <td colspan="3"></td>
                     <td colspan="5">
                        <ul>
                           <li ng-repeat="problem in event.problems track by problem.description"
                               className="ax-event-problem">
                              <i className="fa fa-warning"></i> {{ problem.description }}
                           </li>
                        </ul>
                     </td>
                  </tr>
                  <tr className="ax-event-payload"
                      ng-if="event.showDetails">
                     <td colspan="3"></td>
                     <td colspan="5" ><pre>{{event.formattedEvent}}</pre></td>
                  </tr>
               </tbody>
            </table>
         )
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      reactRender(
         {affix}
         {eventListTable}
      )
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      onDomAvailable: render
   };
}

export default {
   name: 'events-display-widget',
   injections: [ 'axContext', 'axReactRender', 'axFlowService' ],
   create
};
