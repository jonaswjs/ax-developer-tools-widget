define(['exports', 'module', 'react', 'laxar-patterns', 'moment', './tracker'], function (exports, module, _react, _laxarPatterns, _moment, _tracker) {/**
                                                                                                                                                        * Copyright 2016 aixigo AG
                                                                                                                                                        * Released under the MIT license.
                                                                                                                                                        * http://laxarjs.org/license
                                                                                                                                                        */'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ('value' in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass, superClass) {if (typeof superClass !== 'function' && superClass !== null) {throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _React = _interopRequireDefault(_react);var _axPatterns = _interopRequireDefault(_laxarPatterns);var _moment2 = _interopRequireDefault(_moment);var _tracker2 = _interopRequireDefault(_tracker);







   function create(context, reactRender, flowService) {
      'use strict';

      var settingGroups = ['patterns', 'interactions', 'sources'];

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      context.resources = {};

      _axPatterns['default'].resources.handlerFor(context).registerResourceFromFeature('filter', { 
         onUpdateReplace: runFilters, 
         isOptional: true });

      var model = { 
         patterns: [
         { name: 'lifecycle', htmlIcon: '<i class="fa fa-recycle"></i>', eventTypes: [
            'endLifecycle', 'beginLifecycle'] }, 

         { name: 'navigation', htmlIcon: '<i class="fa fa-location-arrow"></i>', eventTypes: [
            'navigate'] }, 

         { name: 'resources', htmlIcon: '<i class="fa fa-file-text-o"></i>', eventTypes: [
            'replace', 'update', 'validate', 'save'] }, 

         { name: 'actions', htmlIcon: '<i class="fa fa-rocket"></i>', eventTypes: [
            'takeAction'] }, 

         { name: 'flags', htmlIcon: '<i class="fa fa-flag"></i>', eventTypes: [
            'changeFlag'] }, 

         { name: 'i18n', htmlIcon: '<i class="fa fa-globe"></i>', eventTypes: [
            'changeLocale'] }, 

         { name: 'visibility', htmlIcon: '<i class="fa fa-eye"></i>', eventTypes: [
            'changeAreaVisibility', 'changeWidgetVisibility'] }, 

         { name: 'other', htmlIcon: '&nbsp;', eventTypes: [] }], 

         index: 0, 
         eventInfos: [], 
         visibleEventInfos: [], 
         problemSummary: { 
            count: 0, 
            eventInfos: [] }, 

         selectionEventInfo: null, 
         settings: { 
            namePattern: '', 
            visibleEventsLimit: 100, 
            patterns: {}, 
            interactions: { 
               subscribe: true, 
               publish: true, 
               deliver: true, 
               unsubscribe: true }, 

            sources: { 
               widgets: true, 
               runtime: true } } };




      context.view = { 
         showPatterns: false, 
         patternsByName: (function () {
            var result = {};
            model.patterns.forEach(function (pattern) {
               result[pattern.name] = pattern;});

            return result;})() };



      var commands = { 
         setAll: function setAll(toValue) {
            settingGroups.forEach(function (groupName) {
               var group = model.settings[groupName];
               for (var _name in group) {
                  if (group.hasOwnProperty[_name]) {
                     group[_name] = toValue;}}});}, 




         setDefaults: function setDefaults() {
            settingGroups.forEach(function (groupName) {
               var group = model.settings[groupName];
               for (var _name2 in group) {
                  if (group.hasOwnProperty[_name2]) {
                     group[_name2] = true;}}});



            model.patterns.forEach(function (patternInfo) {
               model.settings.patterns[patternInfo.name] = true;});

            context.features.filter.hidePatterns.forEach(function (pattern) {
               model.settings.patterns[pattern] = false;});

            context.features.filter.hideSources.forEach(function (pattern) {
               model.settings.sources[pattern] = false;});

            context.features.filter.hideInteractions.forEach(function (pattern) {
               model.settings.interactions[pattern] = false;});}, 


         clearFilters: function clearFilters() {
            model.settings.namePattern = '';
            model.settings.visibleEventsLimit = null;
            context.commands.setAll(true);}, 

         select: function select(eventInfo) {
            model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
            runFilters();}, 

         discard: function discard() {
            model.eventInfos = [];
            model.selectionEventInfo = null;
            runFilters();
            refreshProblemSummary();}, 

         runFilters: runFilters };


      commands.setDefaults();

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      if (context.features.events.stream) {
         context.eventBus.subscribe('didProduce.' + context.features.events.stream, function (event) {
            if (Array.isArray(event.data) && event.data.length) {
               event.data.forEach(addEvent);} else 

            {
               addEvent(event.data);}

            runFilters();});}



      //context.$watch( 'model.settings', runFilters, true );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function addEvent(eventInfo) {

         var completeEventInfo = { 
            index: ++model.index, 
            interaction: eventInfo.action, 
            cycleId: eventInfo.cycleId > -1 ? eventInfo.cycleId : '-', 
            eventObject: eventInfo.eventObject || {}, 
            formattedEvent: JSON.stringify(eventInfo.eventObject, null, 3), 
            formattedTime: { 
               upper: (0, _moment2['default'])(eventInfo.time).format('HH:mm'), 
               lower: (0, _moment2['default'])(eventInfo.time).format('ss.SSS') }, 

            name: eventInfo.event || '?', 
            pattern: pattern((eventInfo.event || '?').toLowerCase()), 
            showDetails: false, 
            source: (eventInfo.source || '?').replace(/^widget\./, ''), 
            target: (eventInfo.target || '?').replace(/^-$/, ''), 
            time: eventInfo.time, 
            selected: false, 
            sourceType: (eventInfo.source || '?').indexOf('widget.') === 0 ? 'widgets' : 'runtime', 
            problems: _tracker2['default'].track(eventInfo) };


         model.eventInfos.unshift(completeEventInfo);
         if (completeEventInfo.problems.length) {
            refreshProblemSummary();}


         if (model.eventInfos.length > context.features.events.bufferSize) {
            var removedInfo = model.eventInfos.pop();
            if (removedInfo.problems.length) {
               refreshProblemSummary();}}



         function pattern(eventName) {
            var matchingPatthern = model.patterns.filter(function (pattern) {
               return pattern.eventTypes.some(function (eventType) {
                  return eventName.indexOf(eventType.toLowerCase()) !== -1;});});


            return matchingPatthern.length ? matchingPatthern[0].name : 'other';}}




      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function refreshProblemSummary() {
         var eventInfos = model.eventInfos.filter(function (info) {
            return info.problems.length > 0;});


         model.problemSummary = { 
            hasProblems: eventInfos.length > 0, 
            eventInfos: eventInfos };}



      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function runFilters() {
         var settings = model.settings;
         var numVisible = 0;

         var searchRegExp = null;
         if (settings.namePattern) {
            try {
               searchRegExp = new RegExp(settings.namePattern, 'gi');} 

            catch (e) {/* ignore invalid search pattern */}}

         var selectionEventInfo = model.selectionEventInfo;

         model.visibleEventInfos = model.eventInfos.filter(function (eventInfo) {
            if (settings.visibleEventsLimit !== null && numVisible >= settings.visibleEventsLimit) {
               return false;}

            if (!settings.interactions[eventInfo.interaction]) {
               return false;}

            if (!settings.patterns[eventInfo.pattern]) {
               return false;}

            if (!settings.sources[eventInfo.sourceType]) {
               return false;}

            if (!matchesFilterResource(eventInfo)) {
               return false;}

            if (!matchesSearchExpression(eventInfo, searchRegExp)) {
               return false;}

            ++numVisible;
            return true;});


         // modify matches in place
         model.visibleEventInfos.forEach(function (eventInfo) {
            eventInfo.htmlName = htmlValue(eventInfo.name, searchRegExp, '.');
            eventInfo.htmlSource = htmlValue(eventInfo.source, searchRegExp, '#');
            eventInfo.htmlTarget = htmlValue(eventInfo.target, searchRegExp, '#');
            eventInfo.selected = !!selectionEventInfo && inSelection(eventInfo, selectionEventInfo);});}



      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function matchesSearchExpression(eventInfo, searchRegExp) {
         return !searchRegExp || [eventInfo.name, eventInfo.source, eventInfo.target].
         some(function (field) {
            var matches = searchRegExp.test(field);
            searchRegExp.lastIndex = 0;
            return !!matches;});}



      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      var patternTopics = { 
         RESOURCE: ['didReplace', 'didUpdate'], 
         ACTION: ['takeActionRequest', 'willTakeAction', 'didTakeAction'], 
         FLAG: ['didChangeFlag'], 
         CONTAINER: ['changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility'] };


      function matchesFilterResource(eventInfo) {
         if (!context.resources.filter) {
            return true;}


         var filterTopics = context.resources.filter.topics || [];
         var filterParticipants = context.resources.filter.participants || [];
         if (!filterTopics.length && !filterParticipants.length) {
            return true;}


         var matchesTopicFilter = filterTopics.
         some(function (item) {
            var prefixes = patternTopics[item.pattern];
            return prefixes.some(function (prefix) {
               var topic = prefix + '.' + item.topic;
               return eventInfo.name === topic || eventInfo.name.indexOf(topic + '.') === 0;});});



         var matchesParticipantsFilter = ['target', 'source'].some(function (field) {
            var value = eventInfo[field];
            return filterParticipants.
            map(function (_) {return _.participant;}).
            some(isSuffixOf(value));});


         return matchesTopicFilter || matchesParticipantsFilter;

         function isSuffixOf(value) {
            return function (_) {
               var tail = '#' + _;
               return value.length >= tail.length && value.indexOf(tail) === value.length - tail.length;};}}




      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function htmlValue(value, searchRegExp, splitCharacter) {
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

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function inSelection(eventInfo, selectionEventInfo) {
         if (!selectionEventInfo) {
            return false;}


         return eventInfo === selectionEventInfo || 
         eventInfo.cycleId === selectionEventInfo.cycleId && 
         eventInfo.source === selectionEventInfo.source && 
         eventInfo.name === selectionEventInfo.name;}



      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function separate(label, separator, defaultText) {
         var name = label || defaultText;
         var splitPoint = name.indexOf(separator);
         return { 
            upper: splitPoint === -1 ? name : name.substr(0, splitPoint), 
            lower: splitPoint === -1 ? defaultText : name.substr(splitPoint, name.length) };}



      function render() {


         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function affix() {
            return _React['default'].createElement('div', null, _React['default'].createElement('p', null, 'affix calling'));
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
                 </div>*/}







         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function eventListTable() {
            if (!model.visibleEventInfos.length) {
               return _React['default'].createElement('p', null, 'no events');}


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
            var 
            ShowDetailsButton = (function (_React$Component) {_inherits(ShowDetailsButton, _React$Component);
               function ShowDetailsButton(props) {_classCallCheck(this, ShowDetailsButton);
                  _get(Object.getPrototypeOf(ShowDetailsButton.prototype), 'constructor', this).call(this, props);
                  this.props = props;
                  this.handleClick = this.handleClick.bind(this);}_createClass(ShowDetailsButton, [{ key: 'handleClick', value: 


                  function handleClick(e) {
                     this.props.onNameChanged(!this.props.showDetails);
                     e.stopPropagation();} }, { key: 'render', value: 


                  function render() {
                     return _React['default'].createElement('button', { type: 'button', 
                        className: 'btn-link btn-info', 
                        onClick: this.handleClick }, 
                     _React['default'].createElement('i', { className: this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" }, ' '));} }]);return ShowDetailsButton;})(_React['default'].Component);var 




            EventBody = (function (_React$Component2) {_inherits(EventBody, _React$Component2);
               function EventBody(props) {_classCallCheck(this, EventBody);
                  _get(Object.getPrototypeOf(EventBody.prototype), 'constructor', this).call(this, props);
                  this.props = props;
                  console.log(props, this.props.interaction);
                  this.state = { showDetails: props.showDetails };
                  this.handleName = this.handleName.bind(this);}_createClass(EventBody, [{ key: 'handleName', value: 


                  function handleName() {
                     this.setState({ showDetails: !this.state.showDetails });} }, { key: 'render', value: 


                  function render() {
                     return _React['default'].createElement('tbody', null, 
                     _React['default'].createElement('tr', { className: 'ax-event-summary' }, 
                     _React['default'].createElement('td', { className: 'ax-col-pattern-icon', 
                        title: '{event.pattern}', 
                        'ng-bind-html': 'view.patternsByName[ event.pattern ].htmlIcon' }), 
                     _React['default'].createElement('td', { className: 'ax-col-interaction' }, this.props.interaction), 
                     _React['default'].createElement('td', { className: 'ax-col-payload-icon' }, 
                     this.props.interaction == 'publish' && 
                     _React['default'].createElement(ShowDetailsButton, { showDetails: this.state.showDetails, onNameChanged: this.handleName })), 


                     _React['default'].createElement('td', null, this.props.htmlName), 
                     _React['default'].createElement('td', null, this.props.htmlSource), 
                     _React['default'].createElement('td', null, this.props.htmlTarget), 
                     _React['default'].createElement('td', { className: 'ax-col-cycle text-right' }, this.props.cycleId), 
                     _React['default'].createElement('td', { className: 'text-right' }, _React['default'].createElement('span', null, this.props.formattedTime.upper), _React['default'].createElement('br', null), 
                     _React['default'].createElement('span', null, this.props.formattedTime.lower))), 


                     this.props.problems.length && 
                     _React['default'].createElement('tr', { className: 'ax-event-payload' }, 
                     _React['default'].createElement('td', { colspan: '3' }), 
                     _React['default'].createElement('td', { colspan: '5' }, 
                     _React['default'].createElement('ul', null, 
                     _React['default'].createElement('li', { className: 'ax-event-problem' }, 'ng-repeat="problem in event.problems track by problem.description"', 

                     _React['default'].createElement('i', { className: 'fa fa-warning' }), ' problem.description')))), 





                     this.state.showDetails && 
                     _React['default'].createElement('tr', { className: 'ax-event-payload' }, 
                     _React['default'].createElement('td', { colspan: '3' }), 
                     _React['default'].createElement('td', { colspan: '5' }, 
                     _React['default'].createElement('pre', null, this.props.formattedEvent))));} }]);return EventBody;})(_React['default'].Component);









            var events = model.visibleEventInfos.map(function (event, key) {
               //return <tbodyEvent key={key} event={event}/>;
               return (
                  _React['default'].createElement(EventBody, _extends({}, event, { key: key })));});



            return (
               _React['default'].createElement('table', { className: 'table' }, 
               _React['default'].createElement('colgroup', null, 
               _React['default'].createElement('col', { className: 'ax-col-pattern-icon' }), 
               _React['default'].createElement('col', { className: 'ax-col-interaction' }), 
               _React['default'].createElement('col', { className: 'ax-col-payload-icon' }), 
               _React['default'].createElement('col', { className: 'ax-col-name' }), 
               _React['default'].createElement('col', { className: 'ax-col-source' }), 
               _React['default'].createElement('col', { className: 'ax-col-target' }), 
               _React['default'].createElement('col', { className: 'ax-col-cycle' }), 
               _React['default'].createElement('col', { className: 'ax-col-timestamp' })), 

               _React['default'].createElement('thead', null, 
               _React['default'].createElement('tr', null, 
               _React['default'].createElement('th', null, ' '), 
               _React['default'].createElement('th', null, 'Action'), 
               _React['default'].createElement('th', null, ' '), 
               _React['default'].createElement('th', null, 'Event Name'), 
               _React['default'].createElement('th', null, 'Source'), 
               _React['default'].createElement('th', null, 'Target'), 
               _React['default'].createElement('th', { className: 'text-right' }, 'Cycle'), 
               _React['default'].createElement('th', { className: 'text-right' }, 'Time', _React['default'].createElement('i', { className: 'fa fa-long-arrow-up' })))), 


               events));}




         ////////////////////////////////////////////////////////////////////////////////////////////////////////


         reactRender(
         _React['default'].createElement('div', null, 
         _React['default'].createElement('p', null, 'hello'), 
         affix(), 
         eventListTable()));}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      return { 
         onDomAvailable: render };}module.exports = 



   { 
      name: 'events-display-widget', 
      injections: ['axContext', 'axReactRender', 'axFlowService'], 
      create: create };});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUc7QUFDbEQsa0JBQVksQ0FBQzs7QUFFYixVQUFJLGFBQWEsR0FBRyxDQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFFLENBQUM7Ozs7QUFJOUQsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXZCLDZCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFFLENBQUMsMkJBQTJCLENBQUUsUUFBUSxFQUFFO0FBQy9FLHdCQUFlLEVBQUUsVUFBVTtBQUMzQixtQkFBVSxFQUFFLElBQUksRUFDbEIsQ0FBRSxDQUFDOztBQUNKLFVBQUksS0FBSyxHQUFHO0FBQ1QsaUJBQVEsRUFBRTtBQUNQLFdBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsK0JBQStCLEVBQUUsVUFBVSxFQUFFO0FBQ3pFLDBCQUFjLEVBQUUsZ0JBQWdCLENBQ2xDLEVBQUU7O0FBQ0gsV0FBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxzQ0FBc0MsRUFBRSxVQUFVLEVBQUU7QUFDakYsc0JBQVUsQ0FDWixFQUFFOztBQUNILFdBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsbUNBQW1DLEVBQUUsVUFBVSxFQUFFO0FBQzdFLHFCQUFTLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQ3pDLEVBQUU7O0FBQ0gsV0FBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSw4QkFBOEIsRUFBRSxVQUFVLEVBQUU7QUFDdEUsd0JBQVksQ0FDZCxFQUFFOztBQUNILFdBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUUsVUFBVSxFQUFFO0FBQ2xFLHdCQUFZLENBQ2QsRUFBRTs7QUFDSCxXQUFF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LGVBQWUsRUFBRSxlQUFlLENBQUU7QUFDN0QsWUFBTSxFQUFOLE1BQU0sRUFDUiIsImZpbGUiOiJldmVudHMtZGlzcGxheS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE2IGFpeGlnbyBBR1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2xheGFyanMub3JnL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4UGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHRyYWNrZXIgZnJvbSAnLi90cmFja2VyJztcblxuXG5mdW5jdGlvbiBjcmVhdGUoIGNvbnRleHQsIHJlYWN0UmVuZGVyLCBmbG93U2VydmljZSApIHtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgbGV0IHNldHRpbmdHcm91cHMgPSBbICdwYXR0ZXJucycsICdpbnRlcmFjdGlvbnMnLCAnc291cmNlcycgXTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY29udGV4dC5yZXNvdXJjZXMgPSB7fTtcblxuICAgYXhQYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZSggJ2ZpbHRlcicsIHtcbiAgICAgIG9uVXBkYXRlUmVwbGFjZTogcnVuRmlsdGVycyxcbiAgICAgIGlzT3B0aW9uYWw6IHRydWVcbiAgIH0gKTtcbiAgIGxldCBtb2RlbCA9IHtcbiAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICB7IG5hbWU6ICdsaWZlY3ljbGUnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtcmVjeWNsZVwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnZW5kTGlmZWN5Y2xlJywgJ2JlZ2luTGlmZWN5Y2xlJ1xuICAgICAgICAgXSB9LFxuICAgICAgICAgeyBuYW1lOiAnbmF2aWdhdGlvbicsIGh0bWxJY29uOiAnPGkgY2xhc3M9XCJmYSBmYS1sb2NhdGlvbi1hcnJvd1wiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnbmF2aWdhdGUnXG4gICAgICAgICBdIH0sXG4gICAgICAgICB7IG5hbWU6ICdyZXNvdXJjZXMnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZmlsZS10ZXh0LW9cIj48L2k+JywgZXZlbnRUeXBlczogW1xuICAgICAgICAgICAgJ3JlcGxhY2UnLCAndXBkYXRlJywgJ3ZhbGlkYXRlJywgJ3NhdmUnXG4gICAgICAgICBdIH0sXG4gICAgICAgICB7IG5hbWU6ICdhY3Rpb25zJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLXJvY2tldFwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAndGFrZUFjdGlvbidcbiAgICAgICAgIF0gfSxcbiAgICAgICAgIHsgbmFtZTogJ2ZsYWdzJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWZsYWdcIj48L2k+JywgZXZlbnRUeXBlczogW1xuICAgICAgICAgICAgJ2NoYW5nZUZsYWcnXG4gICAgICAgICBdIH0sXG4gICAgICAgICB7IG5hbWU6ICdpMThuJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWdsb2JlXCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICdjaGFuZ2VMb2NhbGUnXG4gICAgICAgICBdIH0sXG4gICAgICAgICB7IG5hbWU6ICd2aXNpYmlsaXR5JywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWV5ZVwiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnY2hhbmdlQXJlYVZpc2liaWxpdHknLCAnY2hhbmdlV2lkZ2V0VmlzaWJpbGl0eSdcbiAgICAgICAgIF0gfSxcbiAgICAgICAgIHsgbmFtZTogJ290aGVyJywgaHRtbEljb246ICcmbmJzcDsnLCBldmVudFR5cGVzOiBbXSB9XG4gICAgICBdLFxuICAgICAgaW5kZXg6IDAsXG4gICAgICBldmVudEluZm9zOiBbXSxcbiAgICAgIHZpc2libGVFdmVudEluZm9zOiBbXSxcbiAgICAgIHByb2JsZW1TdW1tYXJ5OiB7XG4gICAgICAgICBjb3VudDogMCxcbiAgICAgICAgIGV2ZW50SW5mb3M6IFtdXG4gICAgICB9LFxuICAgICAgc2VsZWN0aW9uRXZlbnRJbmZvOiBudWxsLFxuICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgIG5hbWVQYXR0ZXJuOiAnJyxcbiAgICAgICAgIHZpc2libGVFdmVudHNMaW1pdDogMTAwLFxuICAgICAgICAgcGF0dGVybnM6IHt9LFxuICAgICAgICAgaW50ZXJhY3Rpb25zOiB7XG4gICAgICAgICAgICBzdWJzY3JpYmU6IHRydWUsXG4gICAgICAgICAgICBwdWJsaXNoOiB0cnVlLFxuICAgICAgICAgICAgZGVsaXZlcjogdHJ1ZSxcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiB0cnVlXG4gICAgICAgICB9LFxuICAgICAgICAgc291cmNlczoge1xuICAgICAgICAgICAgd2lkZ2V0czogdHJ1ZSxcbiAgICAgICAgICAgIHJ1bnRpbWU6IHRydWVcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH07XG5cbiAgIGNvbnRleHQudmlldyA9IHtcbiAgICAgIHNob3dQYXR0ZXJuczogZmFsc2UsXG4gICAgICBwYXR0ZXJuc0J5TmFtZTogKCBmdW5jdGlvbigpIHtcbiAgICAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgICAgIG1vZGVsLnBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgICAgcmVzdWx0WyBwYXR0ZXJuLm5hbWUgXSA9IHBhdHRlcm47XG4gICAgICAgICB9ICk7XG4gICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSApKClcbiAgIH07XG5cbiAgIGxldCBjb21tYW5kcyA9IHtcbiAgICAgIHNldEFsbDogZnVuY3Rpb24oIHRvVmFsdWUgKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1sgZ3JvdXBOYW1lIF07XG4gICAgICAgICAgICBmb3IoIGxldCBuYW1lIGluIGdyb3VwICkge1xuICAgICAgICAgICAgICAgaWYoIGdyb3VwLmhhc093blByb3BlcnR5WyBuYW1lIF0gKSB7XG4gICAgICAgICAgICAgICAgICBncm91cFsgbmFtZSBdID0gdG9WYWx1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgIH0sXG4gICAgICBzZXREZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1sgZ3JvdXBOYW1lIF07XG4gICAgICAgICAgICBmb3IoIGxldCBuYW1lIGluIGdyb3VwICkge1xuICAgICAgICAgICAgICAgaWYoIGdyb3VwLmhhc093blByb3BlcnR5WyBuYW1lIF0gKSB7XG4gICAgICAgICAgICAgICAgICBncm91cFsgbmFtZSBdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgICAgIG1vZGVsLnBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuSW5mbyApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuSW5mby5uYW1lIF0gPSB0cnVlO1xuICAgICAgICAgfSApO1xuICAgICAgICAgY29udGV4dC5mZWF0dXJlcy5maWx0ZXIuaGlkZVBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgICAgbW9kZWwuc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm4gXSA9IGZhbHNlO1xuICAgICAgICAgfSApO1xuICAgICAgICAgY29udGV4dC5mZWF0dXJlcy5maWx0ZXIuaGlkZVNvdXJjZXMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICBtb2RlbC5zZXR0aW5ncy5zb3VyY2VzWyBwYXR0ZXJuIF0gPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICBtb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbIHBhdHRlcm4gXSA9IGZhbHNlO1xuICAgICAgICAgfSApO1xuICAgICAgfSxcbiAgICAgIGNsZWFyRmlsdGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5zZXR0aW5ncy5uYW1lUGF0dGVybiA9ICcnO1xuICAgICAgICAgbW9kZWwuc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ID0gbnVsbDtcbiAgICAgICAgIGNvbnRleHQuY29tbWFuZHMuc2V0QWxsKCB0cnVlICk7XG4gICAgICB9LFxuICAgICAgc2VsZWN0OiBmdW5jdGlvbiggZXZlbnRJbmZvICkge1xuICAgICAgICAgbW9kZWwuc2VsZWN0aW9uRXZlbnRJbmZvID0gZXZlbnRJbmZvLnNlbGVjdGVkID8gbnVsbCA6IGV2ZW50SW5mbztcbiAgICAgICAgIHJ1bkZpbHRlcnMoKTtcbiAgICAgIH0sXG4gICAgICBkaXNjYXJkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgIG1vZGVsLmV2ZW50SW5mb3MgPSBbXTtcbiAgICAgICAgIG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbyA9IG51bGw7XG4gICAgICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgIH0sXG4gICAgICBydW5GaWx0ZXJzOiBydW5GaWx0ZXJzXG4gICB9O1xuXG4gICBjb21tYW5kcy5zZXREZWZhdWx0cygpO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBpZiggY29udGV4dC5mZWF0dXJlcy5ldmVudHMuc3RyZWFtICkge1xuICAgICAgY29udGV4dC5ldmVudEJ1cy5zdWJzY3JpYmUoICdkaWRQcm9kdWNlLicgKyBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5zdHJlYW0sIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgIGlmKCBBcnJheS5pc0FycmF5KCBldmVudC5kYXRhICkgJiYgZXZlbnQuZGF0YS5sZW5ndGggKSB7XG4gICAgICAgICAgICBldmVudC5kYXRhLmZvckVhY2goIGFkZEV2ZW50ICk7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBldmVudC5kYXRhICk7XG4gICAgICAgICB9XG4gICAgICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICB9ICk7XG4gICB9XG5cbiAgIC8vY29udGV4dC4kd2F0Y2goICdtb2RlbC5zZXR0aW5ncycsIHJ1bkZpbHRlcnMsIHRydWUgKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gYWRkRXZlbnQoIGV2ZW50SW5mbyApIHtcblxuICAgICAgbGV0IGNvbXBsZXRlRXZlbnRJbmZvID0ge1xuICAgICAgICAgaW5kZXg6ICsrbW9kZWwuaW5kZXgsXG4gICAgICAgICBpbnRlcmFjdGlvbjogZXZlbnRJbmZvLmFjdGlvbixcbiAgICAgICAgIGN5Y2xlSWQ6IGV2ZW50SW5mby5jeWNsZUlkID4gLTEgPyBldmVudEluZm8uY3ljbGVJZCA6ICctJyxcbiAgICAgICAgIGV2ZW50T2JqZWN0OiBldmVudEluZm8uZXZlbnRPYmplY3QgfHwge30sXG4gICAgICAgICBmb3JtYXR0ZWRFdmVudDogSlNPTi5zdHJpbmdpZnkoIGV2ZW50SW5mby5ldmVudE9iamVjdCwgbnVsbCwgMyApLFxuICAgICAgICAgZm9ybWF0dGVkVGltZToge1xuICAgICAgICAgICAgdXBwZXI6IG1vbWVudCggZXZlbnRJbmZvLnRpbWUgKS5mb3JtYXQoICdISDptbScgKSxcbiAgICAgICAgICAgIGxvd2VyOiBtb21lbnQoIGV2ZW50SW5mby50aW1lICkuZm9ybWF0KCAnc3MuU1NTJyApXG4gICAgICAgICB9LFxuICAgICAgICAgbmFtZTogZXZlbnRJbmZvLmV2ZW50IHx8ICc/JyxcbiAgICAgICAgIHBhdHRlcm46IHBhdHRlcm4oIChldmVudEluZm8uZXZlbnQgfHwgJz8nKS50b0xvd2VyQ2FzZSgpICksXG4gICAgICAgICBzaG93RGV0YWlsczogZmFsc2UsXG4gICAgICAgICBzb3VyY2U6ICggZXZlbnRJbmZvLnNvdXJjZSB8fCAnPycgKS5yZXBsYWNlKCAvXndpZGdldFxcLi8sICcnICksXG4gICAgICAgICB0YXJnZXQ6ICggZXZlbnRJbmZvLnRhcmdldCB8fCAnPycgKS5yZXBsYWNlKCAvXi0kLywgJycgKSxcbiAgICAgICAgIHRpbWU6IGV2ZW50SW5mby50aW1lLFxuICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgc291cmNlVHlwZTogKCBldmVudEluZm8uc291cmNlIHx8ICc/JyApLmluZGV4T2YoICd3aWRnZXQuJyApID09PSAwID8gJ3dpZGdldHMnIDogJ3J1bnRpbWUnLFxuICAgICAgICAgcHJvYmxlbXM6IHRyYWNrZXIudHJhY2soIGV2ZW50SW5mbyApXG4gICAgICB9O1xuXG4gICAgICBtb2RlbC5ldmVudEluZm9zLnVuc2hpZnQoIGNvbXBsZXRlRXZlbnRJbmZvICk7XG4gICAgICBpZiggY29tcGxldGVFdmVudEluZm8ucHJvYmxlbXMubGVuZ3RoICkge1xuICAgICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICB9XG5cbiAgICAgIGlmKCBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCA+IGNvbnRleHQuZmVhdHVyZXMuZXZlbnRzLmJ1ZmZlclNpemUgKSB7XG4gICAgICAgICBsZXQgcmVtb3ZlZEluZm8gPSBtb2RlbC5ldmVudEluZm9zLnBvcCgpO1xuICAgICAgICAgaWYoIHJlbW92ZWRJbmZvLnByb2JsZW1zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwYXR0ZXJuKCBldmVudE5hbWUgKSB7XG4gICAgICAgICBsZXQgbWF0Y2hpbmdQYXR0aGVybiA9IG1vZGVsLnBhdHRlcm5zLmZpbHRlciggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0dGVybi5ldmVudFR5cGVzLnNvbWUoIGZ1bmN0aW9uKCBldmVudFR5cGUgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gZXZlbnROYW1lLmluZGV4T2YoIGV2ZW50VHlwZS50b0xvd2VyQ2FzZSgpICkgIT09IC0xO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfSApO1xuICAgICAgICAgcmV0dXJuIG1hdGNoaW5nUGF0dGhlcm4ubGVuZ3RoID8gbWF0Y2hpbmdQYXR0aGVyblsgMCBdLm5hbWUgOiAnb3RoZXInO1xuICAgICAgfVxuXG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpIHtcbiAgICAgIGxldCBldmVudEluZm9zID0gbW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBpbmZvICkge1xuICAgICAgICAgcmV0dXJuIGluZm8ucHJvYmxlbXMubGVuZ3RoID4gMDtcbiAgICAgIH0gKTtcblxuICAgICAgbW9kZWwucHJvYmxlbVN1bW1hcnkgPSB7XG4gICAgICAgICBoYXNQcm9ibGVtczogZXZlbnRJbmZvcy5sZW5ndGggPiAwLFxuICAgICAgICAgZXZlbnRJbmZvczogZXZlbnRJbmZvc1xuICAgICAgfTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcnVuRmlsdGVycygpIHtcbiAgICAgIGxldCBzZXR0aW5ncyA9IG1vZGVsLnNldHRpbmdzO1xuICAgICAgbGV0IG51bVZpc2libGUgPSAwO1xuXG4gICAgICBsZXQgc2VhcmNoUmVnRXhwID0gbnVsbDtcbiAgICAgIGlmKCBzZXR0aW5ncy5uYW1lUGF0dGVybiApIHtcbiAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZWFyY2hSZWdFeHAgPSBuZXcgUmVnRXhwKCBzZXR0aW5ncy5uYW1lUGF0dGVybiwgJ2dpJyApO1xuICAgICAgICAgfVxuICAgICAgICAgY2F0Y2goIGUgKSB7IC8qIGlnbm9yZSBpbnZhbGlkIHNlYXJjaCBwYXR0ZXJuICovIH1cbiAgICAgIH1cbiAgICAgIGxldCBzZWxlY3Rpb25FdmVudEluZm8gPSBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm87XG5cbiAgICAgIG1vZGVsLnZpc2libGVFdmVudEluZm9zID0gbW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICBpZiggc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICE9PSBudWxsICYmIG51bVZpc2libGUgPj0gc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5pbnRlcmFjdGlvbnNbIGV2ZW50SW5mby5pbnRlcmFjdGlvbiBdICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5wYXR0ZXJuc1sgZXZlbnRJbmZvLnBhdHRlcm4gXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3Muc291cmNlc1sgZXZlbnRJbmZvLnNvdXJjZVR5cGUgXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc1NlYXJjaEV4cHJlc3Npb24oIGV2ZW50SW5mbywgc2VhcmNoUmVnRXhwICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICArK251bVZpc2libGU7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gKTtcblxuICAgICAgLy8gbW9kaWZ5IG1hdGNoZXMgaW4gcGxhY2VcbiAgICAgIG1vZGVsLnZpc2libGVFdmVudEluZm9zLmZvckVhY2goIGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICBldmVudEluZm8uaHRtbE5hbWUgPSBodG1sVmFsdWUoIGV2ZW50SW5mby5uYW1lLCBzZWFyY2hSZWdFeHAsICcuJyApO1xuICAgICAgICAgZXZlbnRJbmZvLmh0bWxTb3VyY2UgPSBodG1sVmFsdWUoIGV2ZW50SW5mby5zb3VyY2UsIHNlYXJjaFJlZ0V4cCwgJyMnICk7XG4gICAgICAgICBldmVudEluZm8uaHRtbFRhcmdldCA9IGh0bWxWYWx1ZSggZXZlbnRJbmZvLnRhcmdldCwgc2VhcmNoUmVnRXhwLCAnIycgKTtcbiAgICAgICAgIGV2ZW50SW5mby5zZWxlY3RlZCA9ICEhc2VsZWN0aW9uRXZlbnRJbmZvICYmIGluU2VsZWN0aW9uKCBldmVudEluZm8sIHNlbGVjdGlvbkV2ZW50SW5mbyApO1xuICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBtYXRjaGVzU2VhcmNoRXhwcmVzc2lvbiggZXZlbnRJbmZvLCBzZWFyY2hSZWdFeHAgKSB7XG4gICAgICByZXR1cm4gIXNlYXJjaFJlZ0V4cCB8fCBbIGV2ZW50SW5mby5uYW1lLCBldmVudEluZm8uc291cmNlLCBldmVudEluZm8udGFyZ2V0IF1cbiAgICAgICAgIC5zb21lKCBmdW5jdGlvbiggZmllbGQgKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2hlcyA9IHNlYXJjaFJlZ0V4cC50ZXN0KCBmaWVsZCApO1xuICAgICAgICAgICAgc2VhcmNoUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gISFtYXRjaGVzO1xuICAgICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBsZXQgcGF0dGVyblRvcGljcyA9IHtcbiAgICAgIFJFU09VUkNFOiBbICdkaWRSZXBsYWNlJywgJ2RpZFVwZGF0ZScgXSxcbiAgICAgIEFDVElPTjogWyAndGFrZUFjdGlvblJlcXVlc3QnLCAnd2lsbFRha2VBY3Rpb24nLCAnZGlkVGFrZUFjdGlvbicgXSxcbiAgICAgIEZMQUc6IFsgJ2RpZENoYW5nZUZsYWcnIF0sXG4gICAgICBDT05UQUlORVI6IFsgJ2NoYW5nZUFyZWFWaXNpYmlsaXR5UmVxdWVzdCcsICd3aWxsQ2hhbmdlQXJlYVZpc2liaWxpdHknLCAnZGlkQ2hhbmdlQXJlYVZpc2liaWxpdHknIF1cbiAgIH07XG5cbiAgIGZ1bmN0aW9uIG1hdGNoZXNGaWx0ZXJSZXNvdXJjZSggZXZlbnRJbmZvICkge1xuICAgICAgaWYoICFjb250ZXh0LnJlc291cmNlcy5maWx0ZXIgKSB7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGZpbHRlclRvcGljcyA9IGNvbnRleHQucmVzb3VyY2VzLmZpbHRlci50b3BpY3MgfHwgW107XG4gICAgICBsZXQgZmlsdGVyUGFydGljaXBhbnRzID0gY29udGV4dC5yZXNvdXJjZXMuZmlsdGVyLnBhcnRpY2lwYW50cyB8fCBbXTtcbiAgICAgIGlmKCAhZmlsdGVyVG9waWNzLmxlbmd0aCAmJiAhZmlsdGVyUGFydGljaXBhbnRzLmxlbmd0aCApIHtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgbWF0Y2hlc1RvcGljRmlsdGVyID0gZmlsdGVyVG9waWNzXG4gICAgICAgICAuc29tZSggZnVuY3Rpb24oIGl0ZW0gKSB7XG4gICAgICAgICAgICBsZXQgcHJlZml4ZXMgPSBwYXR0ZXJuVG9waWNzWyBpdGVtLnBhdHRlcm4gXTtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlcy5zb21lKCBmdW5jdGlvbiggcHJlZml4ICkge1xuICAgICAgICAgICAgICAgbGV0IHRvcGljID0gcHJlZml4ICsgJy4nICsgaXRlbS50b3BpYztcbiAgICAgICAgICAgICAgIHJldHVybiBldmVudEluZm8ubmFtZSA9PT0gdG9waWMgfHwgZXZlbnRJbmZvLm5hbWUuaW5kZXhPZiggdG9waWMgKyAnLicgKSA9PT0gMDtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgbGV0IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXIgPSBbICd0YXJnZXQnLCAnc291cmNlJyBdLnNvbWUoIGZ1bmN0aW9uKCBmaWVsZCApIHtcbiAgICAgICAgIGxldCB2YWx1ZSA9IGV2ZW50SW5mb1sgZmllbGQgXTtcbiAgICAgICAgIHJldHVybiBmaWx0ZXJQYXJ0aWNpcGFudHNcbiAgICAgICAgICAgIC5tYXAoIGZ1bmN0aW9uKCBfICkgeyByZXR1cm4gXy5wYXJ0aWNpcGFudDsgfSApXG4gICAgICAgICAgICAuc29tZSggaXNTdWZmaXhPZiggdmFsdWUgKSApO1xuICAgICAgfSApO1xuXG4gICAgICByZXR1cm4gbWF0Y2hlc1RvcGljRmlsdGVyIHx8IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXI7XG5cbiAgICAgIGZ1bmN0aW9uIGlzU3VmZml4T2YoIHZhbHVlICkge1xuICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBfICkge1xuICAgICAgICAgICAgbGV0IHRhaWwgPSAnIycgKyBfO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSB0YWlsLmxlbmd0aCAmJiB2YWx1ZS5pbmRleE9mKCB0YWlsICkgPT09IHZhbHVlLmxlbmd0aCAtIHRhaWwubGVuZ3RoO1xuICAgICAgICAgfTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaHRtbFZhbHVlKCB2YWx1ZSwgc2VhcmNoUmVnRXhwLCBzcGxpdENoYXJhY3RlciApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIC8vIGxldCBodG1sID0gJHNhbml0aXplKCB2YWx1ZSApO1xuICAgICAgLy8gbGV0IHdhc1NwbGl0ID0gZmFsc2U7XG4gICAgICAvLyBpZiggIXNlYXJjaFJlZ0V4cCApIHtcbiAgICAgIC8vICAgIHJldHVybiB3cmFwKCBzcGxpdCggaHRtbCwgZmFsc2UgKSApO1xuICAgICAgLy8gfVxuICAgICAgLy9cbiAgICAgIC8vIGxldCBwYXJ0cyA9IFtdO1xuICAgICAgLy8gbGV0IG1hdGNoO1xuICAgICAgLy8gbGV0IGxhc3RJbmRleCA9IDA7XG4gICAgICAvLyBsZXQgbGltaXQgPSAxO1xuICAgICAgLy8gd2hpbGUoIGxpbWl0LS0gJiYgKCBtYXRjaCA9IHNlYXJjaFJlZ0V4cC5leGVjKCBodG1sICkgKSAhPT0gbnVsbCApIHtcbiAgICAgIC8vICAgIGlmKCBtYXRjaC5pbmRleCA+IGxhc3RJbmRleCApIHtcbiAgICAgIC8vICAgICAgIHBhcnRzLnB1c2goIHNwbGl0KCBodG1sLnN1YnN0cmluZyggbGFzdEluZGV4LCBtYXRjaC5pbmRleCApLCBmYWxzZSApICk7XG4gICAgICAvLyAgICB9XG4gICAgICAvLyAgICBwYXJ0cy5wdXNoKCAnPGI+JyApO1xuICAgICAgLy8gICAgcGFydHMucHVzaCggc3BsaXQoIG1hdGNoWyAwIF0sIHRydWUgKSApO1xuICAgICAgLy8gICAgcGFydHMucHVzaCggJzwvYj4nICk7XG4gICAgICAvLyAgICBsYXN0SW5kZXggPSBzZWFyY2hSZWdFeHAubGFzdEluZGV4O1xuICAgICAgLy8gfVxuICAgICAgLy8gc2VhcmNoUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgICAvLyBwYXJ0cy5wdXNoKCBzcGxpdCggaHRtbC5zdWJzdHJpbmcoIGxhc3RJbmRleCwgaHRtbC5sZW5ndGggKSApICk7XG4gICAgICAvLyByZXR1cm4gd3JhcCggcGFydHMuam9pbiggJycgKSApO1xuICAgICAgLy9cbiAgICAgIC8vIGZ1bmN0aW9uIHdyYXAoIHdob2xlICkge1xuICAgICAgLy8gICAgcmV0dXJuICc8c3Bhbj4nICsgd2hvbGUgKyAnPC9zcGFuPic7XG4gICAgICAvLyB9XG4gICAgICAvL1xuICAgICAgLy8gZnVuY3Rpb24gc3BsaXQoIHBhcnQsIGlzQm9sZCApIHtcbiAgICAgIC8vICAgIGlmKCAhc3BsaXRDaGFyYWN0ZXIgfHwgd2FzU3BsaXQgKSB7XG4gICAgICAvLyAgICAgICByZXR1cm4gcGFydDtcbiAgICAgIC8vICAgIH1cbiAgICAgIC8vXG4gICAgICAvLyAgICBsZXQgc3BsaXRQb2ludCA9IHBhcnQuaW5kZXhPZiggc3BsaXRDaGFyYWN0ZXIgKTtcbiAgICAgIC8vICAgIGlmKCBzcGxpdFBvaW50ID09PSAtMSApIHtcbiAgICAgIC8vICAgICAgIHJldHVybiBwYXJ0O1xuICAgICAgLy8gICAgfVxuICAgICAgLy9cbiAgICAgIC8vICAgIHdhc1NwbGl0ID0gdHJ1ZTtcbiAgICAgIC8vICAgIHJldHVybiBwYXJ0LnN1YnN0cmluZyggMCwgc3BsaXRQb2ludCApICtcbiAgICAgIC8vICAgICAgICggaXNCb2xkID8gJzwvYj4nIDogJycgKSArICc8L3NwYW4+PGJyIC8+PHNwYW4+JyArICggaXNCb2xkID8gJzxiPicgOiAnJyApICtcbiAgICAgIC8vICAgICAgIHBhcnQuc3Vic3RyaW5nKCBzcGxpdFBvaW50ICsgMSwgcGFydC5sZW5ndGggKTtcbiAgICAgIC8vIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaW5TZWxlY3Rpb24oIGV2ZW50SW5mbywgc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgaWYoICFzZWxlY3Rpb25FdmVudEluZm8gKSB7XG4gICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBldmVudEluZm8gPT09IHNlbGVjdGlvbkV2ZW50SW5mbyB8fCAoXG4gICAgICAgICBldmVudEluZm8uY3ljbGVJZCA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLmN5Y2xlSWQgJiZcbiAgICAgICAgIGV2ZW50SW5mby5zb3VyY2UgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5zb3VyY2UgJiZcbiAgICAgICAgIGV2ZW50SW5mby5uYW1lID09PSBzZWxlY3Rpb25FdmVudEluZm8ubmFtZVxuICAgICAgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gc2VwYXJhdGUoIGxhYmVsLCBzZXBhcmF0b3IsIGRlZmF1bHRUZXh0ICkge1xuICAgICAgbGV0IG5hbWUgPSBsYWJlbCB8fCBkZWZhdWx0VGV4dDtcbiAgICAgIGxldCBzcGxpdFBvaW50ID0gbmFtZS5pbmRleE9mKCBzZXBhcmF0b3IgKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICB1cHBlcjogc3BsaXRQb2ludCA9PT0gLTEgPyBuYW1lIDogbmFtZS5zdWJzdHIoIDAsIHNwbGl0UG9pbnQgKSxcbiAgICAgICAgIGxvd2VyOiBzcGxpdFBvaW50ID09PSAtMSA/IGRlZmF1bHRUZXh0IDogbmFtZS5zdWJzdHIoIHNwbGl0UG9pbnQsIG5hbWUubGVuZ3RoIClcbiAgICAgIH07XG4gICB9XG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcblxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBhZmZpeCgpIHtcbiAgICAgICAgIHJldHVybiAoIDxkaXY+PHA+YWZmaXggY2FsbGluZzwvcD48L2Rpdj4gKTtcbiAgICAgICAgIC8qXG4gICAgICAgICBjb25zdCBldmVudEluZm9MaXN0ID0gbW9kZWwucHJvYmxlbVN1bW1hcnkuZXZlbnRJbmZvcy5tYXAoICggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPGxpIGtleT17ZXZlbnQubmFtZX0+XG4gICAgICAgICAgICAgICAgICA8aDU+PHN0cm9uZz57IGV2ZW50Lm5hbWUgfTwvc3Ryb25nPiA8ZW0+KHNvdXJjZTogeyBldmVudC5zb3VyY2UgfSk8L2VtPjwvaDU+XG4gICAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcm9ibGVtcy5tYXAoICggcHJvYmxlbXMgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17cHJvYmxlbS5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJheC1ldmVudC1wcm9ibGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS13YXJuaW5nIGF4LWVycm9yXCIvPiB7IHByb2JsZW0uZGVzY3JpcHRpb24gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKVxuICAgICAgICAgfSApO1xuXG4gICAgICAgICBjbGFzcyBGaWx0ZXJzRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHRoaXMucHJvcHMubmFtZX07XG5cbiAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCggdGhpcyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoYW5kbGVDaGFuZ2UoIGV2ZW50ICkge1xuICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSgge3ZhbHVlOiBldmVudC50YXJnZXQudmFsdWV9ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBheC1mb3I9XCInc2VhcmNoJ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPkZpbHRlcnM6PC9zbWFsbD5cbiAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCAoUmVnRXhwKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXgtaWQ9XCInc2VhcmNoJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgY29uc3QgZmlsdGVycyA9IDxGaWx0ZXJzRm9ybSBuYW1lPVwibW9kZWwuc2V0dGluZ3MubmFtZVBhdHRlcm5cIi8+O1xuXG4gICAgICAgICBjb25zdCBsaW1pdCA9IChcbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgPGxhYmVsIGF4LWZvcj1cIidsaW1pdCdcIj5cbiAgICAgICAgICAgICAgICAgIDxzbWFsbD5MaW1pdDo8L3NtYWxsPlxuICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIlxuICAgICAgICAgICAgICAgICAgICAgIGF4LWlkPVwiJ2xpbWl0J1wiXG4gICAgICAgICAgICAgICAgICAgICAgbmctbW9kZWw9XCJtb2RlbC5zZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXRcIlxuICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsLW9wdGlvbnM9XCJ7IHVwZGF0ZU9uOiAnZGVmYXVsdCcgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgYXgtaW5wdXQ9XCJpbnRlZ2VyXCJcbiAgICAgICAgICAgICAgICAgICAgICBheC1pbnB1dC1taW5pbXVtLXZhbHVlPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgYXgtaW5wdXQtbWF4aW11bS12YWx1ZT1cImZlYXR1cmVzLmV2ZW50cy5idWZmZXJTaXplXCJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjAte3sgZmVhdHVyZXMuZXZlbnRzLmJ1ZmZlclNpemUgfX1cIlxuICAgICAgICAgICAgICAgICAgICAgIG1heGxlbmd0aD1cIjRcIi8+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICApO1xuICAgICAgICAgcmV0dXJuIHtmaWx0ZXJzfTtcbiAgICAgICovXG4gICAgICAvKiAgIGNvbnN0IGZpbHRlck1lbnUgPSAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc21cIlxuICAgICAgICAgICAgICAgICBuZy1jbGFzc05hbWU9XCJ7ICdvcGVuJzogdmlldy5zaG93UGF0dGVybnMgfVwiXG4gICAgICAgICAgICAgICAgIG5nLW1vdXNlZW50ZXI9XCJ2aWV3LnNob3dQYXR0ZXJucyA9IHRydWVcIlxuICAgICAgICAgICAgICAgICBuZy1tb3VzZWxlYXZlPVwidmlldy5zaG93UGF0dGVybnMgPSBmYWxzZVwiPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPVwie3sgdmlldy5zaG93UGF0dGVybnMgfX1cIj5cbiAgICAgICAgICAgICAgICAgIE1vcmUgPHNwYW4gY2xhc3NOYW1lPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudSBjb250YWluZXIgY29sLWxnLTZcIiByb2xlPVwibWVudVwiPlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgZmlyc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoND5QYXR0ZXJuczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cInBhdHRlcm4gaW4gbW9kZWwucGF0dGVybnMgdHJhY2sgYnkgcGF0dGVybi5uYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cIm1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuLm5hbWUgXSA9ICFtb2RlbC5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBhdHRlcm5cIiBuZy1iaW5kLWh0bWw9XCJwYXR0ZXJuLmh0bWxJY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgcGF0dGVybi5uYW1lIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBwdWxsLXJpZ2h0IGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzPVwieyAnZmEtdG9nZ2xlLW9mZic6ICFtb2RlbC5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF0sICdmYS10b2dnbGUtb24nOiBtb2RlbC5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF0gfVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgbGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGg0PkludGVyYWN0aW9uczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cIihpbnRlcmFjdGlvbiwgZW5hYmxlZCkgaW4gbW9kZWwuc2V0dGluZ3MuaW50ZXJhY3Rpb25zIHRyYWNrIGJ5IGludGVyYWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cIm1vZGVsLnNldHRpbmdzLmludGVyYWN0aW9uc1sgaW50ZXJhY3Rpb24gXSA9ICFlbmFibGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID57eyBpbnRlcmFjdGlvbiB9fTxpIGNsYXNzTmFtZT1cImZhIHB1bGwtcmlnaHQgYXgtZXZlbnQtc2V0dGluZy10b2dnbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzTmFtZT1cInsgJ2ZhLXRvZ2dsZS1vZmYnOiAhZW5hYmxlZCwgJ2ZhLXRvZ2dsZS1vbic6IGVuYWJsZWQgfVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoND5Tb3VyY2VzPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVwiKHNvdXJjZSwgZW5hYmxlZCkgaW4gbW9kZWwuc2V0dGluZ3Muc291cmNlcyB0cmFjayBieSBzb3VyY2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsaWNrPVwibW9kZWwuc2V0dGluZ3Muc291cmNlc1sgc291cmNlIF0gPSAhZW5hYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+e3sgc291cmNlIH19PGkgY2xhc3NOYW1lPVwiZmEgcHVsbC1yaWdodCBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XCJ7ICdmYS10b2dnbGUtb2ZmJzogIWVuYWJsZWQsICdmYS10b2dnbGUtb24nOiBlbmFibGVkIH1cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgZmlyc3RcIj4mbmJzcDs8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc2V0dGluZ3MtY29sIGxhc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4tcHJpbWFyeVwiIG5nLWNsaWNrPVwiY29tbWFuZHMuc2V0QWxsKCB0cnVlIClcIj5BbGwgT248L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLXByaW1hcnlcIiBuZy1jbGljaz1cImNvbW1hbmRzLnNldEFsbCggZmFsc2UgKVwiPkFsbCBPZmY8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHNcIiBuZy1jbGljaz1cImNvbW1hbmRzLnNldERlZmF1bHRzKClcIj5EZWZhdWx0czwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgKTsqL1xuXG4gICAgICAgLyogIHJldHVyblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1hZmZpeC1hcmVhXCJcbiAgICAgICAgICAgICAgICAgYXgtYWZmaXhcbiAgICAgICAgICAgICAgICAgYXgtYWZmaXgtb2Zmc2V0LXRvcD1cIjEwMFwiPlxuICAgICAgICAgICAgICAgeyAhbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj5FbXB0eSBFdmVudHMgTGlzdDwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxpIGNsYXNzTmFtZT1cImZhIGZhLWNsb2NrLW9cIj48L2k+IFdhaXRpbmcgZm9yIGV2ZW50cyBmcm9tIGhvc3QgYXBwbGljYXRpb24uLi48L3A+XG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgeyBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCAmJiAhbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+MC97IG1vZGVsLmV2ZW50SW5mb3MubGVuZ3RoIH0gRXZlbnQgSXRlbXM8L2g0PlxuICAgICAgICAgICAgICAgICAgICA8cD5ObyBldmVudHMgbWF0Y2hpbmcgY3VycmVudCBmaWx0ZXJzLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz1cImNvbW1hbmRzLmNsZWFyRmlsdGVyc1wiPlNob3cgQWxsPC9idXR0b24+PC9wPlxuICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgeyBtb2RlbC5wcm9ibGVtU3VtbWFyeS5oYXNQcm9ibGVtcyAmJlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5IGF4LWVycm9yXCI+eyBtb2RlbC5wcm9ibGVtU3VtbWFyeS5ldmVudEluZm9zLmxlbmd0aCB9L3sgbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggfSBFdmVudHMgd2l0aCBQcm9ibGVtczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICA8dWw+e2V2ZW50SW5mb0xpc3R9PC91bD5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbXMtZXhwbGFuYXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgRXZlbnRzIHdpdGggcHJvYmxlbXMgYXJlIG1hcmtlZCA8c3Ryb25nIGNsYXNzTmFtZT1cImF4LWVycm9yXCI+cmVkPC9zdHJvbmc+IGluIHRoZSBldmVudHMgdGFibGUuXG4gICAgICAgICAgICAgICAgICAgICAgIEZpbHRlciBieSBldmVudC9zb3VyY2UgYXMgbmVlZGVkLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgeyBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeVwiPnsgbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubGVuZ3RoIH0veyBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9IEV2ZW50czwvaDQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtYnV0dG9uLXdyYXBwZXIgZm9ybS1pbmxpbmVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtXCI+XG4gICAgICAgICAgICAgICAgICAgICB7ZmlsdGVyc31cbiAgICAgICAgICAgICAgICAgICAgIHtsaW1pdH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG5cbiAgICAgICAgICAgICAgICAgIHtmaWx0ZXJNZW51fVxuXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc21cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XCJ7ICdheC1kaXNhYmxlZCc6ICFtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xpY2s9XCJjb21tYW5kcy5kaXNjYXJkKClcIj5EaXNjYXJkIEV2ZW50czwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1pbmxpbmUgZXZlbnRzLWRpc3BsYXktZmlsdGVyLWl0ZW1zXCIgbmctaWY9XCJyZXNvdXJjZXMuZmlsdGVyLnRvcGljcy5sZW5ndGggfHwgcmVzb3VyY2VzLmZpbHRlci5wYXJ0aWNpcGFudHMubGVuZ3RoXCI+XG4gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGJ0bi1saW5rXCIgaHJlZj1cIiMvdG9vbHMvcGFnZVwiPlBhZ2Ugc2VsZWN0aW9uPC9hPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4taW5mb1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XCJpdGVtIGluIHJlc291cmNlcy5maWx0ZXIudG9waWNzIHRyYWNrIGJ5IGl0ZW0udG9waWNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3NOYW1lPVwiJ2F4LWV2ZW50cy1kaXNwbGF5LXBhdHRlcm4tJyArIGl0ZW0ucGF0dGVyblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3tpdGVtLnRvcGljfX1cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj48c3BhbiBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGJ0bi1pbmZvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cIml0ZW0gaW4gcmVzb3VyY2VzLmZpbHRlci5wYXJ0aWNpcGFudHMgdHJhY2sgYnkgaXRlbS5wYXJ0aWNpcGFudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGFzc05hbWU9XCInYXgtZXZlbnRzLWRpc3BsYXkta2luZC0nICsgaXRlbS5raW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7e2l0ZW0ucGFydGljaXBhbnR9fVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj4qL1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBldmVudExpc3RUYWJsZSgpIHtcbiAgICAgICAgIGlmKCAhbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIDxwPm5vIGV2ZW50czwvcD47XG4gICAgICAgICB9XG5cbiAgICAgICAgIC8vIHsvKmNsYXNzIHRib2R5RXZlbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQgeyovfVxuICAgICAgICAgLy8gICAgey8qY29uc3RydWN0b3IocHJvcHMpIHsqL31cbiAgICAgICAgIC8vICAgICAgIHsvKnN1cGVyKHByb3BzKTsqL31cbiAgICAgICAgIC8vICAgICAgIHsvKnRoaXMuZXZlbnQgPSB0aGlzLmV2ZW50cyovfVxuICAgICAgICAgLy9cbiAgICAgICAgIC8vICAgICAgIHsvKi8vIFRoaXMgYmluZGluZyBpcyBuZWNlc3NhcnkgdG8gbWFrZSBgdGhpc2Agd29yayBpbiB0aGUgY2FsbGJhY2sqL31cbiAgICAgICAgIC8vICAgICAgIHsvKnRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7Ki99XG4gICAgICAgICAvLyAgICB7Lyp9Ki99XG5cbiAgICAgICAgIC8vICAgIGhhbmRsZUNsaWNrKCkge1xuICAgICAgICAgLy8gICAgICAgLy9jb21tYW5kcy5zZWxlY3QoIGV2ZW50IClcIlxuICAgICAgICAgLy8gICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgIC8vICAgICAgICAgIGlzVG9nZ2xlT246ICFwcmV2U3RhdGUuaXNUb2dnbGVPblxuICAgICAgICAgLy8gICAgICAgfSkpO1xuICAgICAgICAgLy8gICAgfVxuICAgICAgICAgLy9cbiAgICAgICAgIC8vICAgIHJlbmRlcigpIHtcbiAgICAgICAgIC8vICAgICAgIHJldHVybiAoXG4gICAgICAgICAvLyAgICAgICAgICA8dGJvZHkgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF0dGVybi0gKyB7ZXZlbnQucGF0dGVybn0gK1xuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgYXgtZXZlbnQtaW50ZXJhY3Rpb24tICsge2V2ZW50LmludGVyYWN0aW9ufSArXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICB7ZXZlbnQuc2VsZWN0ZWQgPyAnIGF4LWV2ZW50LXNlbGVjdGVkJyA6ICcnICkgK1xuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAoIGV2ZW50LnByb2JsZW1zLmxlbmd0aCA/ICcgYXgtZXZlbnQtaGFzLXByb2JsZW1zJyA6ICcnIClcIlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgLy8gICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXN1bW1hcnlcIj5cbiAgICAgICAgIC8vICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF0dGVybi1pY29uXCJcbiAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aXRsZT1cInt7IGV2ZW50LnBhdHRlcm4gfX1cIlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgIG5nLWJpbmQtaHRtbD1cInZpZXcucGF0dGVybnNCeU5hbWVbIGV2ZW50LnBhdHRlcm4gXS5odG1sSWNvblwiPjwvdGQ+XG4gICAgICAgICAvLyAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWludGVyYWN0aW9uXCI+e3tldmVudC5pbnRlcmFjdGlvbn19PC90ZD5cbiAgICAgICAgIC8vICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCI+XG4gICAgICAgICAvLyAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIG5nLWlmPVwiZXZlbnQuaW50ZXJhY3Rpb24gPT0gJ3B1Ymxpc2gnICYmICFldmVudC5zaG93RGV0YWlsc1wiXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsaWNrPVwiZXZlbnQuc2hvd0RldGFpbHMgPSB0cnVlOyAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XCI+PGkgY2xhc3NOYW1lPVwiZmEgZmEtcGx1cy1zcXVhcmVcIj4mbmJzcDs8L2k+PC9idXR0b24+XG4gICAgICAgICAvLyAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIG5nLWlmPVwiZXZlbnQuaW50ZXJhY3Rpb24gPT0gJ3B1Ymxpc2gnICYmIGV2ZW50LnNob3dEZXRhaWxzXCJcbiAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xpY2s9XCJldmVudC5zaG93RGV0YWlscyA9IGZhbHNlOyAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XCI+PGkgY2xhc3NOYW1lPVwiZmEgZmEtbWludXMtc3F1YXJlXCIgPiZuYnNwOzwvaT48L2J1dHRvbj5cbiAgICAgICAgIC8vICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAvLyAgICAgICAgICAgICA8dGQgbmctYmluZC1odG1sPVwiZXZlbnQuaHRtbE5hbWVcIj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIG5nLWJpbmQtaHRtbD1cImV2ZW50Lmh0bWxTb3VyY2VcIj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIG5nLWJpbmQtaHRtbD1cImV2ZW50Lmh0bWxUYXJnZXRcIj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1jeWNsZSB0ZXh0LXJpZ2h0XCI+e3tldmVudC5jeWNsZUlkfX08L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj48c3Bhbj57e2V2ZW50LmZvcm1hdHRlZFRpbWUudXBwZXJ9fTwvc3Bhbj48YnIgLz48c3Bhbj57e2V2ZW50LmZvcm1hdHRlZFRpbWUubG93ZXJ9fTwvc3Bhbj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgPC90cj5cbiAgICAgICAgIC8vICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1wYXlsb2FkXCJcbiAgICAgICAgIC8vICAgICAgICAgICAgICBuZy1pZj1cImV2ZW50LnByb2JsZW1zLmxlbmd0aFwiPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+PC90ZD5cbiAgICAgICAgIC8vICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiNVwiPlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdD1cInByb2JsZW0gaW4gZXZlbnQucHJvYmxlbXMgdHJhY2sgYnkgcHJvYmxlbS5kZXNjcmlwdGlvblwiXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbVwiPlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtd2FybmluZ1wiPjwvaT4ge3sgcHJvYmxlbS5kZXNjcmlwdGlvbiB9fVxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgIC8vICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAvLyAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgPC90cj5cbiAgICAgICAgIC8vICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1wYXlsb2FkXCJcbiAgICAgICAgIC8vICAgICAgICAgICAgICBuZy1pZj1cImV2ZW50LnNob3dEZXRhaWxzXCI+XG4gICAgICAgICAvLyAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI1XCIgPjxwcmU+e3tldmVudC5mb3JtYXR0ZWRFdmVudH19PC9wcmU+PC90ZD5cbiAgICAgICAgIC8vICAgICAgICAgIDwvdHI+XG4gICAgICAgICAvLyAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgLy8gICAgICAgKTtcbiAgICAgICAgIC8vICAgIH1cbiAgICAgICAgIC8vIH1cblxuICAgICAgICAgY2xhc3MgU2hvd0RldGFpbHNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk5hbWVDaGFuZ2VkKCF0aGlzLnByb3BzLnNob3dEZXRhaWxzKTtcbiAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgICAgIHJldHVybiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17IHRoaXMucHJvcHMuc2hvd0RldGFpbHMgPyBcImZhIGZhLW1pbnVzLXNxdWFyZVwiIDogXCJmYSBmYS1wbHVzLXNxdWFyZVwiIH0gPiZuYnNwOzwvaT5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgY2xhc3MgRXZlbnRCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9wcyx0aGlzLnByb3BzLmludGVyYWN0aW9uKVxuICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHsgc2hvd0RldGFpbHM6IHByb3BzLnNob3dEZXRhaWxzIH07XG4gICAgICAgICAgICAgICB0aGlzLmhhbmRsZU5hbWUgPSB0aGlzLmhhbmRsZU5hbWUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGFuZGxlTmFtZSgpe1xuICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd0RldGFpbHM6ICF0aGlzLnN0YXRlLnNob3dEZXRhaWxzfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgICAgIHJldHVybiA8dGJvZHk+XG4gICAgICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc3VtbWFyeVwiPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1wYXR0ZXJuLWljb25cIlxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwie2V2ZW50LnBhdHRlcm59XCJcbiAgICAgICAgICAgICAgICAgICAgICBuZy1iaW5kLWh0bWw9XCJ2aWV3LnBhdHRlcm5zQnlOYW1lWyBldmVudC5wYXR0ZXJuIF0uaHRtbEljb25cIj48L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1pbnRlcmFjdGlvblwiPnt0aGlzLnByb3BzLmludGVyYWN0aW9ufTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLXBheWxvYWQtaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLmludGVyYWN0aW9uID09ICdwdWJsaXNoJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICA8U2hvd0RldGFpbHNCdXR0b24gc2hvd0RldGFpbHM9e3RoaXMuc3RhdGUuc2hvd0RldGFpbHN9IG9uTmFtZUNoYW5nZWQ9e3RoaXMuaGFuZGxlTmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57dGhpcy5wcm9wcy5odG1sTmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPnt0aGlzLnByb3BzLmh0bWxTb3VyY2V9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57dGhpcy5wcm9wcy5odG1sVGFyZ2V0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlIHRleHQtcmlnaHRcIj57dGhpcy5wcm9wcy5jeWNsZUlkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPjxzcGFuPnt0aGlzLnByb3BzLmZvcm1hdHRlZFRpbWUudXBwZXJ9PC9zcGFuPjxiciAvPlxuICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuZm9ybWF0dGVkVGltZS5sb3dlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgIHsgdGhpcy5wcm9wcy5wcm9ibGVtcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBheWxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI1XCI+XG4gICAgICAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImF4LWV2ZW50LXByb2JsZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmctcmVwZWF0PVwicHJvYmxlbSBpbiBldmVudC5wcm9ibGVtcyB0cmFjayBieSBwcm9ibGVtLmRlc2NyaXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtd2FybmluZ1wiPjwvaT4gcHJvYmxlbS5kZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgeyB0aGlzLnN0YXRlLnNob3dEZXRhaWxzICYmXG4gICAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1wYXlsb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICA8cHJlPnt0aGlzLnByb3BzLmZvcm1hdHRlZEV2ZW50fTwvcHJlPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuXG5cbiAgICAgICAgIGNvbnN0IGV2ZW50cyA9IG1vZGVsLnZpc2libGVFdmVudEluZm9zLm1hcCggKCBldmVudCwga2V5ICk9PiB7XG4gICAgICAgICAgICAvL3JldHVybiA8dGJvZHlFdmVudCBrZXk9e2tleX0gZXZlbnQ9e2V2ZW50fS8+O1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxFdmVudEJvZHkgey4uLmV2ZW50fSBrZXk9e2tleX0gLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICB9ICk7XG5cbiAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgIDxjb2xncm91cD5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXBhdHRlcm4taWNvblwiIC8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1pbnRlcmFjdGlvblwiIC8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1wYXlsb2FkLWljb25cIiAvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtbmFtZVwiIC8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1zb3VyY2VcIiAvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtdGFyZ2V0XCIgLz5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlXCIgLz5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXRpbWVzdGFtcFwiIC8+XG4gICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxuICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPiZuYnNwOzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD4mbmJzcDs8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPkV2ZW50IE5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPlNvdXJjZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGg+VGFyZ2V0PC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+Q3ljbGU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj5UaW1lPGkgY2xhc3NOYW1lPVwiZmEgZmEtbG9uZy1hcnJvdy11cFwiIC8+PC90aD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAge2V2ZW50c31cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbiAgICAgIHJlYWN0UmVuZGVyKFxuICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxwPmhlbGxvPC9wPlxuICAgICAgICAgICAge2FmZml4KCl9XG4gICAgICAgICAgICB7ZXZlbnRMaXN0VGFibGUoKX1cbiAgICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICByZXR1cm4ge1xuICAgICAgb25Eb21BdmFpbGFibGU6IHJlbmRlclxuICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgbmFtZTogJ2V2ZW50cy1kaXNwbGF5LXdpZGdldCcsXG4gICBpbmplY3Rpb25zOiBbICdheENvbnRleHQnLCAnYXhSZWFjdFJlbmRlcicsICdheEZsb3dTZXJ2aWNlJyBdLFxuICAgY3JlYXRlXG59O1xuIl19
