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

   let settingGroups = ['patterns', 'interactions', 'sources'];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   context.resources = {};

   axPatterns.resources.handlerFor( context ).registerResourceFromFeature( 'filter', {
      onUpdateReplace: runFilters,
      isOptional: true
   } );

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
         if( !settings.interactions[eventInfo.interaction] ) {
            return false;
         }
         if( !settings.patterns[eventInfo.pattern] ) {
            return false;
         }
         if( !settings.sources[eventInfo.sourceType] ) {
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


   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   //TODO delete model object, its duplicated in affixarea component
   const model = {
      patterns: [
         {
            name: 'lifecycle',
            icon: <i className="fa fa-recycle" />,
            eventTypes: [ 'endLifecycle', 'beginLifecycle' ]
         },
         {
            name: 'navigation',
            icon: <i className="fa fa-location-arrow" />,
            eventTypes: [ 'navigate' ]
         },
         {
            name: 'resources',
            icon: <i className="fa fa-file-text-o" />,
            eventTypes: [ 'replace', 'update', 'validate', 'save' ]
         },
         {
            name: 'actions',
            icon: <i className="fa fa-rocket" />,
            eventTypes: [ 'takeAction' ]
         },
         {
            name: 'flags',
            icon: <i className="fa fa-flag" />,
            eventTypes: [ 'changeFlag' ]
         },
         {
            name: 'i18n',
            icon: <i className="fa fa-globe" />,
            eventTypes: [ 'changeLocale' ]
         },
         {
            name: 'visibility',
            icon: <i className="fa fa-eye" />,
            eventTypes: [ 'changeAreaVisibility', 'changeWidgetVisibility' ]
         },
         {
            name: 'other',
            icon: <i />,
            eventTypes: []
         }
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
            let group = model.settings[groupName];
            for( let name in group ) {
               if( group.hasOwnProperty[name] ) {
                  group[name] = toValue;
               }
            }
         } );
      },
      setDefaults: function() {
         settingGroups.forEach( function( groupName ) {
            let group = model.settings[groupName];
            for( let name in group ) {
               if( group.hasOwnProperty[name] ) {
                  group[name] = true;
               }
            }
         } );
         model.patterns.forEach( function( patternInfo ) {
            model.settings.patterns[patternInfo.name] = true;
         } );
         context.features.filter.hidePatterns.forEach( function( pattern ) {
            model.settings.patterns[pattern] = false;
         } );
         context.features.filter.hideSources.forEach( function( pattern ) {
            model.settings.sources[pattern] = false;
         } );
         context.features.filter.hideInteractions.forEach( function( pattern ) {
            model.settings.interactions[pattern] = false;
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

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            <i className={this.iconClass}/>
         );

      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
         return matchingPatthern.length ? matchingPatthern[0].name : 'other';
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

   function matchesSearchExpression( eventInfo, searchRegExp ) {
      return !searchRegExp || [eventInfo.name, eventInfo.source, eventInfo.target]
            .some( function( field ) {
               let matches = searchRegExp.test( field );
               searchRegExp.lastIndex = 0;
               return !!matches;
            } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   let patternTopics = {
      RESOURCE: ['didReplace', 'didUpdate'],
      ACTION: ['takeActionRequest', 'willTakeAction', 'didTakeAction'],
      FLAG: ['didChangeFlag'],
      CONTAINER: ['changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility']
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
            let prefixes = patternTopics[item.pattern];
            return prefixes.some( function( prefix ) {
               let topic = prefix + '.' + item.topic;
               return eventInfo.name === topic || eventInfo.name.indexOf( topic + '.' ) === 0;
            } );
         } );

      let matchesParticipantsFilter = ['target', 'source'].some( function( field ) {
         let value = eventInfo[field];
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

      class NumberOfEvents extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
            this.clearFilters = this.clearFilters.bind( this );
         }

         clearFilters() {

         }

         render() {
            if( this.props.numberOfEvents === 0  ) {
               return(
                  <div className="text-large">
                  <h4 className="text-primary">Empty Events List</h4>
                  <p><i className="fa fa-clock-o" /> Waiting for events from host application...</p>
                  </div>
               );
            }

            if( this.props.numberOfEvents > 0 && this.props.numberOfVisibleEvents === 0) {
               return(
                  <div className="text-large">
                     <h4 className="text-primary">0/{ this.props.numberOfEvents } Event Items</h4>
                     <p>No events matching current filters.</p>
                     <p>
                        <button type="button"
                                className="btn btn-sm btn-primary"
                                onClick="clearFilters">Show All
                        </button>
                     </p>
                  </div>
               );
            }

            // TODO: ng-if="model.problemSummary.hasProblems

            return (
               <div className="text-large">
                  <h4 className="text-primary">
                     { this.props.numberOfVisibleEvents }/{ this.props.numberOfEvents } Events
                  </h4>
               </div>
            );

         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class FiltersInput extends React.Component {
         constructor( props ) {
            super( props );
            this.state = {value: this.props.name};
            this.handleChange = this.handleChange.bind( this );
         }

         handleChange( event ) {
            this.setState( { value: event.target.value } );
         }

         render() {
            return (
               <input className="form-control input-sm"
                      placeholder="Search (RegExp)"
                      ax-id="'search'"
                      type="text"
                      value={ this.state.value }
                      onChange={ this.handleChange }/>
            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class LimitInput extends React.Component {
         constructor( props ) {
            super( props );
            this.state = { value: this.props.name };
            this.handleChange = this.handleChange.bind( this );
         }

         handleChange( event ) {
            if( event.target.value === '' ) {
               this.setState( {value: value} );
            }
            const value = Number( event.target.value );
            if( !Number.isInteger( value ) ) { return; }
            if( value >= 0 && value <= 5000 ) {
               this.setState( {value: value} );
            }
         }

         render() {
            return (
               <input
                  className="form-control input-sm"
                  type="text"
                  ax-id="'limit'"
                  placeholder={ '0-' + this.props.placeholder }
                  maxLength={ 4 }
                  value={ this.state.value }
                  onChange={ this.handleChange }
               />
            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class FiltersAndLimitForm extends React.Component {
         constructor( props ) {
            super( props );
            this.state = { value: this.props.name };
            this.handleChange = this.handleChange.bind( this );
         }

         handleChange( event ) {
            this.setState( {value: event.target.value} );
         }

         render() {
            return (
               <div className="form-group form-group-sm">
                  <label ax-for="'search'">
                     <small>Filters:</small>
                  </label>
                  <FiltersInput />
                  <label ax-for="'limit'">
                     <small>Limit:</small>
                  </label>
                  <LimitInput placeholder={ 5000 }/>
               </div>
            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class SettingsToggleButton extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
            this.handleClick = this.handleClick.bind( this );
         }

         handleClick( e ) {
            this.props.onSettingsChanged( this.props.type, this.props.text, this.props.enabled  );
            //model.settings.patterns[ pattern.name ] = !model.settings.patterns[ pattern.name ]
            //model.settings.interactions[ interaction ] = !enabled
            // model.settings[ a ][b] = !c
            e.stopPropagation();
         }

         render() {
            const toggleClassNames = 'fa pull-right ax-event-setting-toggle' + (
                  this.props.enabled? ' fa-toggle-on' : ' fa-toggle-off' );
            return (
               <button
                  type="button"
                  className="btn btn-link ax-event-setting-toggle"
                  onClick={ this.handleClick }>{ this.props.icon &&
                  <span className="ax-event-pattern">{ this.props.icon }</span>}
                  { this.props.text } <i className={ toggleClassNames }></i></button>

            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class SelectFiltersButton extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
            this.state = { showPatterns: false };
         }

         render() {
            const handleMouseEnter = () => this.setState( { showPatterns : true } );
            const handleMouseLeave = () => this.setState( { showPatterns : false } );

            const patternsButtons = this.props.patterns.map( pattern => {
               return (
                  <SettingsToggleButton key={ pattern.name }
                                        type="patterns"
                                        text={ pattern.name }
                                        icon={ pattern.icon }
                                        enabled={ this.props.settings.patterns[ pattern.name ] }
                                        onSettingsChanged={this.props.onSettingsChanged}
               /> );
            } );

            const interactionsButtons = Object.keys( this.props.settings.interactions ).map( interaction => {
               return (
                  <SettingsToggleButton key={ interaction }
                                        type="interactions"
                                        text={ interaction }
                                        enabled={ this.props.settings.interactions[ interaction ] }
                                        onSettingsChanged={this.props.onSettingsChanged}
                  /> );
            } );

            const sourceButtons = Object.keys( this.props.settings.sources ).map( source => {
               return (
                  <SettingsToggleButton key={ source }
                                        type="sources"
                                        text={ source }
                                        enabled={ this.props.settings.sources[ source ] }
                                        onSettingsChanged={this.props.onSettingsChanged}
                  /> );
            } );


            const commandBar = (
               <div className="pull-right">
                  <button type="button" className="btn btn-xs btn-primary">All On</button>
                  <button type="button" className="btn btn-xs btn-primary">All Off</button>
                  <button type="button" className="btn btn-xs">Defaults</button>
               </div>
            );
            /*<button type="button" className="btn btn-xs btn-primary" ng-click="commands.setAll( true )">All On</button>
            <button type="button" className="btn btn-xs btn-primary" ng-click="commands.setAll( false )">All Off</button>
            <button type="button" className="btn btn-xs" ng-click="commands.setDefaults()">Defaults</button>*/

            return (
               <div className={ this.state.showPatterns ? 'btn-group btn-group-sm open': 'btn-group btn-group-sm' }
                    onMouseEnter={ handleMouseEnter }
                    onMouseLeave={ handleMouseLeave }>
                  <button type="button"
                          className="btn btn-default dropdown-toggle"
                          data-toggle="dropdown"
                          aria-expanded={ view.showPatterns }>
                     More <span className="caret" />
                  </button>
                  <div className="dropdown-menu container col-lg-6" role="menu">

                     <div className="row">
                        <div className="ax-event-settings-col first">
                           <h4>Patterns</h4>
                           <div>{ patternsButtons }</div>
                        </div>

                        <div className="ax-event-settings-col last">
                           <h4>Interactions</h4>
                           <div>{ interactionsButtons }</div>

                           <br />
                              <h4>Sources</h4>
                           <div>{ sourceButtons }</div>
                        </div>

                     </div>

                     <div className="row">
                        <div className="ax-event-settings-col first">&nbsp;</div>
                        <div className="ax-event-settings-col last">
                           {commandBar}
                        </div>
                     </div>

                  </div>
               </div>
            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class Filters extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
         }

         render() {
            if( !model.eventInfos.length ) {
               return (
                  <div className="text-large">
                     <h4 className="text-primary">Empty Events List</h4>
                     <p><i className="fa fa-clock-o" /> Waiting for events from host application...</p>
                  </div>
               );
            }
            return (
               <div className="ax-button-wrapper form-inline">
                  <FiltersAndLimitForm name="model.settings.namePattern"/>
                  <SelectFiltersButton patterns={ this.props.patterns }
                                       settings={ this.props.settings }
                                       onSettingsChanged={this.props.onSettingsChanged}
                  />
               </div>
            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class DiscardEventsButton extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
            this.handleClick = this.handleClick.bind( this );
         }

         handleClick( e ) {
            e.stopPropagation();
         }

         render() {
            return <div><h4>DiscardEventsButton</h4></div>;
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class AffixArea extends React.Component {

         constructor( props ) {
            super( props );
            this.state = {
               patterns: [
                  {
                     name: 'lifecycle',
                     icon: <i className="fa fa-recycle" />,
                     eventTypes: [ 'endLifecycle', 'beginLifecycle' ]
                  },
                  {
                     name: 'navigation',
                     icon: <i className="fa fa-location-arrow" />,
                     eventTypes: [ 'navigate' ]
                  },
                  {
                     name: 'resources',
                     icon: <i className="fa fa-file-text-o" />,
                     eventTypes: [ 'replace', 'update', 'validate', 'save' ]
                  },
                  {
                     name: 'actions',
                     icon: <i className="fa fa-rocket" />,
                     eventTypes: [ 'takeAction' ]
                  },
                  {
                     name: 'flags',
                     icon: <i className="fa fa-flag" />,
                     eventTypes: [ 'changeFlag' ]
                  },
                  {
                     name: 'i18n',
                     icon: <i className="fa fa-globe" />,
                     eventTypes: [ 'changeLocale' ]
                  },
                  {
                     name: 'visibility',
                     icon: <i className="fa fa-eye" />,
                     eventTypes: [ 'changeAreaVisibility', 'changeWidgetVisibility' ]
                  },
                  {
                     name: 'other',
                     icon: <i />,
                     eventTypes: []
                  }
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

         }



         render() {
            const onSettingsChanged = function (a,b,c) {
               let settings = this.state.settings;
               settings[ a ][ b ] = !c;
               this.setState({
                  settings: settings
               });

            };
            return (
               <div className="ax-affix-area"
                    ax-affix
                    ax-affix-offset-top="100">
                  <NumberOfEvents numberOfVisibleEvents={1} numberOfEvents={1} />
                  <Filters patterns={ this.state.patterns }
                           settings={ this.state.settings }
                           onSettingsChanged={onSettingsChanged}
                  />
                  <DiscardEventsButton />
               </div>
            );
         }


      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class ShowDetailsButton extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
            this.handleClick = this.handleClick.bind( this );
         }

         handleClick( e ) {
            this.props.onNameChanged();
            e.stopPropagation();
         }

         render() {
            return <button type="button"
                           className="btn-link btn-info"
                           onClick={this.handleClick}>
               <i className={ this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" }>&nbsp;</i>
            </button>;
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class EventCell extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
         }

         render() {
            let splitPoint = this.props.content.indexOf( this.props.separator  );
            if( splitPoint === -1 ) {
               return <td><span>{ this.props.content }</span></td>;
            }
            return ( <td>
               <span>{ this.props.content.substring( 0, splitPoint ) }</span><br />
               <span>{ this.props.content.substring( splitPoint + 1, this.props.content.length ) }</span>
            </td> );

         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class EventBody extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
            this.state = {
               showDetails: false
            };
            this.handleName = this.handleName.bind( this );
            this.handleClick = this.handleClick.bind( this );
         }

         handleName() {
            this.setState( {showDetails: !this.state.showDetails} );
         }

         handleClick( e ) {
            this.props.onSelection( this.props.event );
         }

         //////////////////////////////////////////////////////////////////////////////////////////////////

         render() {
            const cssClassName = 'ax-event-pattern-' + this.props.event.pattern +
                           ' ax-event-interaction-' + this.props.event.interaction +
                           ( this.props.selected ? ' ax-event-selected' : '' ) +
                           ( this.props.event.problems.length ? ' ax-event-has-problems' : '' );
            const eventSummaryRow = (
               <tr className="ax-event-summary">
                  <td className="ax-col-pattern-icon"
                      title={this.props.event.pattern}><PatternsHtmlIcon name={this.props.event.pattern}/>
                  </td>
                  <td className="ax-col-interaction">{this.props.event.interaction}</td>
                  <td className="ax-col-payload-icon">
                     { this.props.event.interaction == 'publish' &&
                       <ShowDetailsButton showDetails={this.state.showDetails}
                                          onNameChanged={this.handleName}/>
                     }
                  </td>
                  <EventCell content={this.props.event.name} separator="." />
                  <EventCell content={this.props.event.source} separator="#" />
                  <EventCell content={this.props.event.target} separator="#" />
                  <td className="ax-col-cycle text-right">{this.props.event.cycleId}</td>
                  <td className="text-right"><span>{this.props.event.formattedTime.upper}</span><br />
                     <span>{this.props.event.formattedTime.lower}</span>
                  </td>
               </tr>
            );

            ///////////////////////////////////////////////////////////////////////////////////////////////

            function detailsRow( show, formattedEvent ) {
               if( !show ) {
                  return <tr />;
               }
               return (<tr className="ax-event-payload">
                  <td colSpan="3" />
                  <td colSpan="5">
                     <pre>{formattedEvent}</pre>
                  </td>
               </tr>);
            }

            ///////////////////////////////////////////////////////////////////////////////////////////////

            //TODO: Test display of problems

            function eventProblems( problems ) {
               if( problems.length === 0 ) {
                  return <tr />;
               }
               const listOfProblems = problems.map( ( problem ) => {
                  return (
                     <li key={problem.description} className="ax-event-problem">
                        <i className="fa fa-warning">{problem.description}</i>
                     </li>
                  );
               } );
               return (
                  <tr className="ax-event-payload">
                     <td colSpan="3" />
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
               <tbody className={ cssClassName }
                      onClick={this.handleClick}>
               { eventSummaryRow }
               { eventProblems( this.props.event.problems ) }
               { detailsRow( this.state.showDetails, this.props.event.formattedEvent ) }
               </tbody>
            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class EventListTable extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
         }

         render() {
            const events = this.props.events.map( event => {
               return (
                  <EventBody event={event}
                             key={event.index}
                             viewPatternsByName={view.patternsByName}
                             selectionEventInfo={this.props.selectionEventInfo}
                             onSelection={this.props.onSelection}
                             selected={event.selected}
                  />
               );
            } );

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            return (
               <table className="table">
                  <colgroup>
                     <col className="ax-col-pattern-icon"/>
                     <col className="ax-col-interaction"/>
                     <col className="ax-col-payload-icon"/>
                     <col className="ax-col-name"/>
                     <col className="ax-col-source"/>
                     <col className="ax-col-target"/>
                     <col className="ax-col-cycle"/>
                     <col className="ax-col-timestamp"/>
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
                     <th className="text-right">Time<i className="fa fa-long-arrow-up"/></th>
                  </tr>
                  </thead>
                  {events}
               </table>
            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      class EventDisplayElement extends React.Component {
         constructor( props ) {
            super( props );
            this.props = props;
            this.state = {selectionEventInfo: null};
            this.handleSelection = this.handleSelection.bind( this );
         }

         handleSelection( selectedEvent ) {
            const selectionEventInfoIndex = this.state.selectionEventInfo && this.state.selectionEventInfo.index;

            if( selectedEvent.index === selectionEventInfoIndex ) {
               this.setState( { selectionEventInfo: null } );
               this.props.events.forEach( ( event ) => {
                  event.selected = false;
               } );
               return;
            }

            this.props.events.forEach( ( event ) => {
               if( event.index === selectedEvent.index ) {
                  this.setState( { selectionEventInfo: event } );
                  event.selected = true;
                  return;
               }
               if( inSelection( event, selectedEvent ) ) {
                  event.selected = true;
               }
               else {
                  event.selected = false;
               }
            } );

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
         }

         render() {
            if( this.props.visibleEventInfosLength === 0 ) {
               return <div></div>;
            }
            return ( <EventListTable selectionEventInfo={ this.state.selectionEventInfo }
                                    onSelection={ this.handleSelection }
                                    events={this.props.events}
                    />
            );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      reactRender(
         <div>
            <AffixArea />
            <EventDisplayElement visibleEventInfosLength={model.visibleEventInfos.length}
                                 events={model.visibleEventInfos}
            />
         </div>
      );
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
