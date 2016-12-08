/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import React from 'react';
import axPatterns from 'laxar-patterns';
import moment from 'moment';
import tracker from './tracker';


function create( context, reactRender, flowService ) {
   'use strict';

   let settingGroups = [ 'patterns', 'interactions', 'sources' ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   context.resources = {};

   axPatterns.resources.handlerFor( context ).registerResourceFromFeature( 'filter', {
      onUpdateReplace: runFilters,
      isOptional: true
   } );

   class PatternsHtmlIcon extends React.Component {

      constructor( props ) {
         super( props );
         this.props = props;

         switch( props.name ) {
            case 'lifecycle':
               this.iconClass = 'fa fa-recycle';
               break;
            case 'navigation':
               this.iconClass = 'fa fa-location-arrow';
               break;
            case 'resources':
               this.iconClass = 'fa fa-file-text-o';
               break;
            case 'actions':
               this.iconClass = 'fa fa-rocket';
               break;
            case 'flags':
               this.iconClass = 'fa fa-flag';
               break;
            case 'i18n':
               this.iconClass = 'fa fa-globe';
               break;
            case 'visibility':
               this.iconClass = 'fa fa-eye';
               break;
            default:
               this.iconClass = '';
         }
      }

      render() {
         return (
            <i className={this.iconClass} />
         );

      }
   }


   let model = {
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

   const view = {
      showPatterns: false
   };

   let commands = {
      setAll: function( toValue ) {
         settingGroups.forEach( function( groupName ) {
            let group = model.settings[ groupName ];
            for( let name in group ) {
               if( group.hasOwnProperty[ name ] ) {
                  group[ name ] = toValue;
               }
            }
         } );
      },
      setDefaults: function() {
         settingGroups.forEach( function( groupName ) {
            let group = model.settings[ groupName ];
            for( let name in group ) {
               if( group.hasOwnProperty[ name ] ) {
                  group[ name ] = true;
               }
            }
         } );
         model.patterns.forEach( function( patternInfo ) {
            model.settings.patterns[ patternInfo.name ] = true;
         } );
         context.features.filter.hidePatterns.forEach( function( pattern ) {
            model.settings.patterns[ pattern ] = false;
         } );
         context.features.filter.hideSources.forEach( function( pattern ) {
            model.settings.sources[ pattern ] = false;
         } );
         context.features.filter.hideInteractions.forEach( function( pattern ) {
            model.settings.interactions[ pattern ] = false;
         } );
      },
      clearFilters: function() {
         model.settings.namePattern = '';
         model.settings.visibleEventsLimit = null;
         context.commands.setAll( true );
      },
      // select: function( eventInfo ) {
      //    model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
      //    runFilters();
      // },
      discard: function() {
         model.eventInfos = [];
         model.selectionEventInfo = null;
         runFilters();
         refreshProblemSummary();
      },
      runFilters: runFilters
   };

   commands.setDefaults();

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

   //context.$watch( 'model.settings', runFilters, true );

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function addEvent( eventInfo ) {

      let completeEventInfo = {
         index: ++model.index,
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

      model.eventInfos.unshift( completeEventInfo );
      if( completeEventInfo.problems.length ) {
         refreshProblemSummary();
      }

      if( model.eventInfos.length > context.features.events.bufferSize ) {
         let removedInfo = model.eventInfos.pop();
         if( removedInfo.problems.length ) {
            refreshProblemSummary();
         }
      }

      function pattern( eventName ) {
         let matchingPatthern = model.patterns.filter( function( pattern ) {
            return pattern.eventTypes.some( function( eventType ) {
               return eventName.indexOf( eventType.toLowerCase() ) !== -1;
            } );
         } );
         return matchingPatthern.length ? matchingPatthern[ 0 ].name : 'other';
      }

   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function refreshProblemSummary() {
      let eventInfos = model.eventInfos.filter( function( info ) {
         return info.problems.length > 0;
      } );

      model.problemSummary = {
         hasProblems: eventInfos.length > 0,
         eventInfos: eventInfos
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function runFilters() {
      let settings = model.settings;
      let numVisible = 0;

      let searchRegExp = null;
      if( settings.namePattern ) {
         try {
            searchRegExp = new RegExp( settings.namePattern, 'gi' );
         }
         catch( e ) { /* ignore invalid search pattern */ }
      }
      let selectionEventInfo = model.selectionEventInfo;

      model.visibleEventInfos = model.eventInfos.filter( function( eventInfo ) {
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
      model.visibleEventInfos.forEach( function( eventInfo ) {
         eventInfo.htmlName = htmlValue( eventInfo.name, searchRegExp, '.' );
         eventInfo.htmlSource = htmlValue( eventInfo.source, searchRegExp, '#' );
         eventInfo.htmlTarget = htmlValue( eventInfo.target, searchRegExp, '#' );
         eventInfo.selected = !!selectionEventInfo && inSelection( eventInfo, selectionEventInfo );
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function matchesSearchExpression( eventInfo, searchRegExp ) {
      return !searchRegExp || [ eventInfo.name, eventInfo.source, eventInfo.target ]
         .some( function( field ) {
            let matches = searchRegExp.test( field );
            searchRegExp.lastIndex = 0;
            return !!matches;
         } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   let patternTopics = {
      RESOURCE: [ 'didReplace', 'didUpdate' ],
      ACTION: [ 'takeActionRequest', 'willTakeAction', 'didTakeAction' ],
      FLAG: [ 'didChangeFlag' ],
      CONTAINER: [ 'changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility' ]
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function matchesFilterResource( eventInfo ) {
      if( !context.resources.filter ) {
         return true;
      }

      let filterTopics = context.resources.filter.topics || [];
      let filterParticipants = context.resources.filter.participants || [];
      if( !filterTopics.length && !filterParticipants.length ) {
         return true;
      }

      let matchesTopicFilter = filterTopics
         .some( function( item ) {
            let prefixes = patternTopics[ item.pattern ];
            return prefixes.some( function( prefix ) {
               let topic = prefix + '.' + item.topic;
               return eventInfo.name === topic || eventInfo.name.indexOf( topic + '.' ) === 0;
            } );
         } );

      let matchesParticipantsFilter = [ 'target', 'source' ].some( function( field ) {
         let value = eventInfo[ field ];
         return filterParticipants
            .map( function( _ ) { return _.participant; } )
            .some( isSuffixOf( value ) );
      } );

      return matchesTopicFilter || matchesParticipantsFilter;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function isSuffixOf( value ) {
         return function( _ ) {
            let tail = '#' + _;
            return value.length >= tail.length && value.indexOf( tail ) === value.length - tail.length;
         };
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function htmlValue( value, searchRegExp, splitCharacter ) {
      return value;
      // let html = $sanitize( value );
      // let wasSplit = false;
      // if( !searchRegExp ) {
      //    return wrap( split( html, false ) );
      // }
      //
      // let parts = [];
      // let match;
      // let lastIndex = 0;
      // let limit = 1;
      // while( limit-- && ( match = searchRegExp.exec( html ) ) !== null ) {
      //    if( match.index > lastIndex ) {
      //       parts.push( split( html.substring( lastIndex, match.index ), false ) );
      //    }
      //    parts.push( '<b>' );
      //    parts.push( split( match[ 0 ], true ) );
      //    parts.push( '</b>' );
      //    lastIndex = searchRegExp.lastIndex;
      // }
      // searchRegExp.lastIndex = 0;
      // parts.push( split( html.substring( lastIndex, html.length ) ) );
      // return wrap( parts.join( '' ) );
      //
      // function wrap( whole ) {
      //    return '<span>' + whole + '</span>';
      // }
      //
      // function split( part, isBold ) {
      //    if( !splitCharacter || wasSplit ) {
      //       return part;
      //    }
      //
      //    let splitPoint = part.indexOf( splitCharacter );
      //    if( splitPoint === -1 ) {
      //       return part;
      //    }
      //
      //    wasSplit = true;
      //    return part.substring( 0, splitPoint ) +
      //       ( isBold ? '</b>' : '' ) + '</span><br /><span>' + ( isBold ? '<b>' : '' ) +
      //       part.substring( splitPoint + 1, part.length );
      // }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function separate( label, separator, defaultText ) {
      let name = label || defaultText;
      let splitPoint = name.indexOf( separator );
      return {
         upper: splitPoint === -1 ? name : name.substr( 0, splitPoint ),
         lower: splitPoint === -1 ? defaultText : name.substr( splitPoint, name.length )
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function render() {


      function affix() {
         return ( <div><p>affix calling</p></div> );
         /*
         const eventInfoList = model.problemSummary.eventInfos.map( ( event ) => {
            return (
               <li key={event.name}>
                  <h5><strong>{ event.name }</strong> <em>(source: { event.source })</em></h5>
                  <ul>
                     {
                        event.problems.map( ( problems ) => {
                           return (
                              <li key={problem.description}
                                  className="ax-event-problem">
                                 <i className="fa fa-warning ax-error"/> { problem.description }
                              </li>
                           );
                        } )
                     }
                  </ul>
               </li>
            )
         } );

         class FiltersForm extends React.Component {
            constructor( props ) {
               super( props );
               this.state = {value: this.props.name};

               this.handleChange = this.handleChange.bind( this );
            }

            handleChange( event ) {
               this.setState( {value: event.target.value} );
            }

            render() {
               return (
                  <form>
                     <label ax-for="'search'">
                        <small>Filters:</small>
                     </label>
                     <input className="form-control input-sm"
                            placeholder="Search (RegExp)"
                            ax-id="'search'"
                            type="text"
                            value={this.state.value}
                            onChange={this.handleChange}/>
                  </form>
               );
            }
         }

         const filters = <FiltersForm name="model.settings.namePattern"/>;

         const limit = (
            <form>
               <label ax-for="'limit'">
                  <small>Limit:</small>
               </label>
               <input className="form-control input-sm"
                      ax-id="'limit'"
                      ng-model="model.settings.visibleEventsLimit"
                      ng-model-options="{ updateOn: 'default' }"
                      ax-input="integer"
                      ax-input-minimum-value="0"
                      ax-input-maximum-value="features.events.bufferSize"
                      placeholder="0-{{ features.events.bufferSize }}"
                      maxlength="4"/>
            </form>
         );
         return {filters};
      */
      /*   const filterMenu = (
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
         );*/

       /*  return
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
               { model.visibleEventInfos.length &&
                  <div className="text-large">
                     <h4 className="text-primary">{ model.visibleEventInfos.length }/{ model.eventInfos.length } Events</h4>
                  </div>
               }
               <div className="ax-button-wrapper form-inline">
                  <div className="form-group form-group-sm">
                     {filters}
                     {limit}
                  </div>


                  {filterMenu}

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
            </div>*/
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function eventListTable() {
         if( !model.visibleEventInfos.length ) {
            return <p>no events</p>;
         }

         // {/*class tbodyEvent extends React.Component {*/}
         //    {/*constructor(props) {*/}
         //       {/*super(props);*/}
         //       {/*this.event = this.events*/}
         //
         //       {/*// This binding is necessary to make `this` work in the callback*/}
         //       {/*this.handleClick = this.handleClick.bind(this);*/}
         //    {/*}*/}

         //    handleClick() {
         //       //commands.select( event )"
         //       this.setState(prevState => ({
         //          isToggleOn: !prevState.isToggleOn
         //       }));
         //    }
         //
         //    render() {
         //       return (
         //          <tbody className="ax-event-pattern- + {event.pattern} +
         //                      ax-event-interaction- + {event.interaction} +
         //                      {event.selected ? ' ax-event-selected' : '' ) +
         //                        ( event.problems.length ? ' ax-event-has-problems' : '' )"
         //                 onClick={this.handleClick}>
         //          <tr className="ax-event-summary">
         //             <td className="ax-col-pattern-icon"
         //                 title="{{ event.pattern }}"
         //                 ng-bind-html="view.patternsByName[ event.pattern ].htmlIcon"></td>
         //             <td className="ax-col-interaction">{{event.interaction}}</td>
         //             <td className="ax-col-payload-icon">
         //                <button type="button" className="btn-link btn-info"
         //                        ng-if="event.interaction == 'publish' && !event.showDetails"
         //                        ng-click="event.showDetails = true; $event.stopPropagation();"><i className="fa fa-plus-square">&nbsp;</i></button>
         //                <button type="button" className="btn-link btn-info"
         //                        ng-if="event.interaction == 'publish' && event.showDetails"
         //                        ng-click="event.showDetails = false; $event.stopPropagation();"><i className="fa fa-minus-square" >&nbsp;</i></button>
         //             </td>
         //             <td ng-bind-html="event.htmlName"></td>
         //             <td ng-bind-html="event.htmlSource"></td>
         //             <td ng-bind-html="event.htmlTarget"></td>
         //             <td className="ax-col-cycle text-right">{{event.cycleId}}</td>
         //             <td className="text-right"><span>{{event.formattedTime.upper}}</span><br /><span>{{event.formattedTime.lower}}</span></td>
         //          </tr>
         //          <tr className="ax-event-payload"
         //              ng-if="event.problems.length">
         //             <td colspan="3"></td>
         //             <td colspan="5">
         //                <ul>
         //                   <li ng-repeat="problem in event.problems track by problem.description"
         //                       className="ax-event-problem">
         //                      <i className="fa fa-warning"></i> {{ problem.description }}
         //                   </li>
         //                </ul>
         //             </td>
         //          </tr>
         //          <tr className="ax-event-payload"
         //              ng-if="event.showDetails">
         //             <td colspan="3"></td>
         //             <td colspan="5" ><pre>{{event.formattedEvent}}</pre></td>
         //          </tr>
         //          </tbody>
         //       );
         //    }
         // }

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         class ShowDetailsButton extends React.Component {
            constructor(props) {
               super(props);
               this.props = props;
               this.handleClick = this.handleClick.bind(this);
            }

            handleClick( e ) {
               this.props.onNameChanged(!this.props.showDetails);
               e.stopPropagation();
            }

            render() {
               return <button type="button"
                          className="btn-link btn-info"
                     onClick={this.handleClick}>
                     <i className={ this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" } >&nbsp;</i>
                  </button>;
            }
         }

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         class EventBody extends React.Component {
            constructor(props) {
               super(props);
               this.props = props;
               this.state = {
                  showDetails: props.event.showDetails,
                  cssClassName: ''
               };
               this.handleName = this.handleName.bind(this);
               this.state.cssClassName = 'ax-event-pattern-' + this.props.event.pattern +
               ' ax-event-interaction-' + this.props.event.interaction +
               ( this.props.event.selected ? ' ax-event-selected' : '' ) +
               ( this.props.event.problems.length ? ' ax-event-has-problems' : '' );
            }

            handleName(){
               this.setState( { showDetails: !this.state.showDetails } );
            }

            handleClick( e ) {
               // select: function( eventInfo ) {
               //    model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
               //    runFilters();
               // },
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            render() {
               const eventSummaryRow = (
                  <tr className="ax-event-summary">
                     <td className="ax-col-pattern-icon"
                         title={this.props.event.pattern}> <PatternsHtmlIcon name={this.props.event.pattern} /></td>
                     <td className="ax-col-interaction">{this.props.event.interaction}</td>
                     <td className="ax-col-payload-icon">
                        { this.props.event.interaction == 'publish' &&
                          <ShowDetailsButton showDetails={this.state.showDetails} onNameChanged={this.handleName}/>
                        }
                     </td>
                     <td>{this.props.event.htmlName}</td>
                     <td>{this.props.event.htmlSource}</td>
                     <td>{this.props.event.htmlTarget}</td>
                     <td className="ax-col-cycle text-right">{this.props.event.cycleId}</td>
                     <td className="text-right"><span>{this.props.event.formattedTime.upper}</span><br />
                        <span>{this.props.event.formattedTime.lower}</span>
                     </td>
                  </tr>
               );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               function detailsRow( show, formattedEvent ) {
                  if(!show) {
                     return <tr />;
                  }
                  return  (<tr className="ax-event-payload">
                     <td colSpan="3"></td>
                     <td colSpan="5">
                        <pre>{formattedEvent}</pre>
                     </td>
                  </tr>);
               }

               ///////////////////////////////////////////////////////////////////////////////////////////////

               //TODO: Test display of problems

               function eventProblems( problems ) {
                  const listOfProblems = problems.map( ( problem ) => {
                     return (
                        <li key={problem.description} className="ax-event-problem">
                           <i className="fa fa-warning"></i> problem.description
                        </li>
                     );
                  } );
                  return (
                     <tr className="ax-event-payload">
                        <td colSpan="3"></td>
                        <td colSpan="5">
                           <ul>
                              {listOfProblems}
                           </ul>
                        </td>
                     </tr>
                  );
               }

               ///////////////////////////////////////////////////////////////////////////////////////////////

               return (
                  <tbody
                     className={ this.state.cssClassName }
                     onClick={this.handleClick}
                  >
                     { eventSummaryRow }
                     { this.props.event.problems.length && eventProblems( this.props.event.problems ) }
                     { detailsRow( this.state.showDetails, this.props.event.formattedEvent ) }
                  </tbody>
               );
            }
         }

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         const events = model.visibleEventInfos.map( ( event, key )=> {
            console.log(event)
            return (
               //<EventBody {...event} key={key} viewPatternsByName={view.patternsByName}/>
               <EventBody event={event} key={key} viewPatternsByName={view.patternsByName}/>
            );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         return (
            <table className="table">
               <colgroup>
                  <col className="ax-col-pattern-icon" />
                  <col className="ax-col-interaction" />
                  <col className="ax-col-payload-icon" />
                  <col className="ax-col-name" />
                  <col className="ax-col-source" />
                  <col className="ax-col-target" />
                  <col className="ax-col-cycle" />
                  <col className="ax-col-timestamp" />
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
                     <th className="text-right">Time<i className="fa fa-long-arrow-up" /></th>
                  </tr>
               </thead>
               {events}
            </table>
         );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////


      reactRender(
         <div>
            <p>hello</p>
            {affix()}
            {eventListTable()}
         </div>
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
