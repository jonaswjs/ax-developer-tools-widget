define(['exports', 'module', 'react', 'laxar-patterns', 'moment', './tracker'], function (exports, module, _react, _laxarPatterns, _moment, _tracker) {/**
                                                                                                                                                        * Copyright 2016 aixigo AG
                                                                                                                                                        * Released under the MIT license.
                                                                                                                                                        * http://laxarjs.org/license
                                                                                                                                                        */'use strict';var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ('value' in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass, superClass) {if (typeof superClass !== 'function' && superClass !== null) {throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _React = _interopRequireDefault(_react);var _axPatterns = _interopRequireDefault(_laxarPatterns);var _moment2 = _interopRequireDefault(_moment);var _tracker2 = _interopRequireDefault(_tracker);







   function create(context, reactRender, flowService) {
      'use strict';

      var settingGroups = ['patterns', 'interactions', 'sources'];

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      context.resources = {};

      _axPatterns['default'].resources.handlerFor(context).registerResourceFromFeature('filter', { 
         onUpdateReplace: runFilters, 
         isOptional: true });var 


      PatternsHtmlIcon = (function (_React$Component) {_inherits(PatternsHtmlIcon, _React$Component);

         function PatternsHtmlIcon(props) {_classCallCheck(this, PatternsHtmlIcon);
            _get(Object.getPrototypeOf(PatternsHtmlIcon.prototype), 'constructor', this).call(this, props);
            this.props = props;

            switch (props.name) {
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
                  this.iconClass = '';}}_createClass(PatternsHtmlIcon, [{ key: 'render', value: 



            function render() {
               return (
                  _React['default'].createElement('i', { className: this.iconClass }));} }]);return PatternsHtmlIcon;})(_React['default'].Component);






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




      var view = { 
         showPatterns: false };


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

         // select: function( eventInfo ) {
         //    model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
         //    runFilters();
         // },
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




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function refreshProblemSummary() {
         var eventInfos = model.eventInfos.filter(function (info) {
            return info.problems.length > 0;});


         model.problemSummary = { 
            hasProblems: eventInfos.length > 0, 
            eventInfos: eventInfos };}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function matchesSearchExpression(eventInfo, searchRegExp) {
         return !searchRegExp || [eventInfo.name, eventInfo.source, eventInfo.target].
         some(function (field) {
            var matches = searchRegExp.test(field);
            searchRegExp.lastIndex = 0;
            return !!matches;});}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      var patternTopics = { 
         RESOURCE: ['didReplace', 'didUpdate'], 
         ACTION: ['takeActionRequest', 'willTakeAction', 'didTakeAction'], 
         FLAG: ['didChangeFlag'], 
         CONTAINER: ['changeAreaVisibilityRequest', 'willChangeAreaVisibility', 'didChangeAreaVisibility'] };


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         function isSuffixOf(value) {
            return function (_) {
               var tail = '#' + _;
               return value.length >= tail.length && value.indexOf(tail) === value.length - tail.length;};}}




      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function inSelection(eventInfo, selectionEventInfo) {
         if (!selectionEventInfo) {
            return false;}


         return eventInfo === selectionEventInfo || 
         eventInfo.cycleId === selectionEventInfo.cycleId && 
         eventInfo.source === selectionEventInfo.source && 
         eventInfo.name === selectionEventInfo.name;}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function separate(label, separator, defaultText) {
         var name = label || defaultText;
         var splitPoint = name.indexOf(separator);
         return { 
            upper: splitPoint === -1 ? name : name.substr(0, splitPoint), 
            lower: splitPoint === -1 ? defaultText : name.substr(splitPoint, name.length) };}



      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {


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

            /////////////////////////////////////////////////////////////////////////////////////////////////////
            var 
            ShowDetailsButton = (function (_React$Component2) {_inherits(ShowDetailsButton, _React$Component2);
               function ShowDetailsButton(props) {_classCallCheck(this, ShowDetailsButton);
                  _get(Object.getPrototypeOf(ShowDetailsButton.prototype), 'constructor', this).call(this, props);
                  this.props = props;
                  this.handleClick = this.handleClick.bind(this);}
















               /////////////////////////////////////////////////////////////////////////////////////////////////////
               _createClass(ShowDetailsButton, [{ key: 'handleClick', value: function handleClick(e) {this.props.onNameChanged(!this.props.showDetails);e.stopPropagation();} }, { key: 'render', value: function render() {return _React['default'].createElement('button', { type: 'button', className: 'btn-link btn-info', onClick: this.handleClick }, _React['default'].createElement('i', { className: this.props.showDetails ? "fa fa-minus-square" : "fa fa-plus-square" }, ' '));} }]);return ShowDetailsButton;})(_React['default'].Component);var 
            EventBody = (function (_React$Component3) {_inherits(EventBody, _React$Component3);
               function EventBody(props) {_classCallCheck(this, EventBody);
                  _get(Object.getPrototypeOf(EventBody.prototype), 'constructor', this).call(this, props);
                  this.props = props;
                  this.state = { 
                     showDetails: props.event.showDetails, 
                     cssClassName: '' };

                  this.handleName = this.handleName.bind(this);
                  this.state.cssClassName = 'ax-event-pattern-' + this.props.event.pattern + 
                  ' ax-event-interaction-' + this.props.event.interaction + (
                  this.props.event.selected ? ' ax-event-selected' : '') + (
                  this.props.event.problems.length ? ' ax-event-has-problems' : '');}

























































































               /////////////////////////////////////////////////////////////////////////////////////////////////////
               _createClass(EventBody, [{ key: 'handleName', value: function handleName() {this.setState({ showDetails: !this.state.showDetails });} }, { key: 'handleClick', value: function handleClick(e) {} // select: function( eventInfo ) {
                  //    model.selectionEventInfo = eventInfo.selected ? null : eventInfo;
                  //    runFilters();
                  // },
                  //////////////////////////////////////////////////////////////////////////////////////////////////
               }, { key: 'render', value: function render() {var eventSummaryRow = _React['default'].createElement('tr', { className: 'ax-event-summary' }, _React['default'].createElement('td', { className: 'ax-col-pattern-icon', title: this.props.event.pattern }, ' ', _React['default'].createElement(PatternsHtmlIcon, { name: this.props.event.pattern })), _React['default'].createElement('td', { className: 'ax-col-interaction' }, this.props.event.interaction), _React['default'].createElement('td', { className: 'ax-col-payload-icon' }, this.props.event.interaction == 'publish' && _React['default'].createElement(ShowDetailsButton, { showDetails: this.state.showDetails, onNameChanged: this.handleName })), _React['default'].createElement('td', null, this.props.event.htmlName), _React['default'].createElement('td', null, this.props.event.htmlSource), _React['default'].createElement('td', null, this.props.event.htmlTarget), _React['default'].createElement('td', { className: 'ax-col-cycle text-right' }, this.props.event.cycleId), _React['default'].createElement('td', { className: 'text-right' }, _React['default'].createElement('span', null, this.props.event.formattedTime.upper), _React['default'].createElement('br', null), _React['default'].createElement('span', null, this.props.event.formattedTime.lower))); ///////////////////////////////////////////////////////////////////////////////////////////////
                     function detailsRow(show, formattedEvent) {if (!show) {return _React['default'].createElement('tr', null);}return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('pre', null, formattedEvent)));} ///////////////////////////////////////////////////////////////////////////////////////////////
                     //TODO: Test display of problems
                     function eventProblems(problems) {var listOfProblems = problems.map(function (problem) {return _React['default'].createElement('li', { key: problem.description, className: 'ax-event-problem' }, _React['default'].createElement('i', { className: 'fa fa-warning' }), ' problem.description');});return _React['default'].createElement('tr', { className: 'ax-event-payload' }, _React['default'].createElement('td', { colSpan: '3' }), _React['default'].createElement('td', { colSpan: '5' }, _React['default'].createElement('ul', null, listOfProblems)));} ///////////////////////////////////////////////////////////////////////////////////////////////
                     return _React['default'].createElement('tbody', { className: this.state.cssClassName, onClick: this.handleClick }, eventSummaryRow, this.props.event.problems.length && eventProblems(this.props.event.problems), detailsRow(this.state.showDetails, this.props.event.formattedEvent));} }]);return EventBody;})(_React['default'].Component);var events = model.visibleEventInfos.map(function (event, key) {console.log(event);return (//<EventBody {...event} key={key} viewPatternsByName={view.patternsByName}/>
                  _React['default'].createElement(EventBody, { event: event, key: key, viewPatternsByName: view.patternsByName }));}); /////////////////////////////////////////////////////////////////////////////////////////////////////
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy1kaXNwbGF5LXdpZGdldC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsWUFBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUc7QUFDbEQsa0JBQVksQ0FBQzs7QUFFYixVQUFJLGFBQWEsR0FBRyxDQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFFLENBQUM7Ozs7QUFJOUQsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXZCLDZCQUFXLFNBQVMsQ0FBQyxVQUFVLENBQUUsT0FBTyxDQUFFLENBQUMsMkJBQTJCLENBQUUsUUFBUSxFQUFFO0FBQy9FLHdCQUFlLEVBQUUsVUFBVTtBQUMzQixtQkFBVSxFQUFFLElBQUksRUFDbEIsQ0FBRSxDQUFDOzs7QUFFRSxzQkFBZ0IsMkNBQWhCLGdCQUFnQjs7QUFFUixrQkFGUixnQkFBZ0IsQ0FFTixLQUFLLEVBQUcsdUJBRmxCLGdCQUFnQjtBQUdoQix1Q0FIQSxnQkFBZ0IsNkNBR1QsS0FBSyxFQUFHO0FBQ2YsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixvQkFBUSxLQUFLLENBQUMsSUFBSTtBQUNmLG9CQUFLLFdBQVc7QUFDYixzQkFBSSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7QUFDakMsd0JBQU07QUFDVCxvQkFBSyxZQUFZO0FBQ2Qsc0JBQUksQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLENBQUM7QUFDeEMsd0JBQU07QUFDVCxvQkFBSyxXQUFXO0FBQ2Isc0JBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUM7QUFDckMsd0JBQU07QUFDVCxvQkFBSyxTQUFTO0FBQ1gsc0JBQUksQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDO0FBQ2hDLHdCQUFNO0FBQ1Qsb0JBQUssT0FBTztBQUNULHNCQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztBQUM5Qix3QkFBTTtBQUNULG9CQUFLLE1BQU07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LEVBQUMsT0FBTztBQUNyQjtBQUNHLHdEQUFLLFNBQVMsRUFBQyxxQkFBcUIsR0FBRztBQUN2Qyx3REFBSyxTQUFTLEVBQUMsb0JBQW9CLEdBQUc7QUFDdEMsd0RBQUssU0FBUyxFQUFDLHFCQUFxQixHQUFHO0FBQ3ZDLHdEQUFLLFNBQVMsRUFBQyxhQUFhLEdBQUc7QUFDL0Isd0RBQUssU0FBUyxFQUFDLGVBQWUsR0FBRztBQUNqQyx3REFBSyxTQUFTLEVBQUMsZUFBZSxHQUFHO0FBQ2pDLHdEQUFLLFNBQVMsRUFBQyxjQUFjLEdBQUc7QUFDaEMsd0RBQUssU0FBUyxFQUFDLGtCQUFrQixHQUFHLENBQzVCOztBQUNYO0FBQ0c7QUFDRywrREFBZTtBQUNmLG9FQUFlO0FBQ2YsK0RBQWU7QUFDZix3RUFBbUI7QUFDbkIsb0VBQWU7QUFDZixvRUFBZTtBQUNmLHVEQUFJLFNBQVMsRUFBQyxZQUFZLFlBQVc7QUFDckMsdURBQUksU0FBUyxFQUFDLFlBQVksWUFBSyx1Q0FBRyxTQUFTLEVBQUMscUJBQXFCLEdBQUcsQ0FBSyxDQUN2RSxDQUNBOzs7QUFDUCxxQkFBTSxDQUNGLEVBQ1QsQ0FDSjs7Ozs7Ozs7QUFLRCxvQkFBVztBQUNSO0FBQ0csNERBQVk7QUFDWCxjQUFLLEVBQUU7QUFDUCx1QkFBYyxFQUFFLENBQ2QsQ0FDUixDQUFBLENBQ0g7Ozs7Ozs7QUFJRCxhQUFPO0FBQ0osdUJBQWMsRUFBRSxNQUFNLEVBQ3hCLENBQUMsQ0FDSjs7OztBQUVjO0FBQ1osVUFBSSxFQUFFLHVCQUF1QjtBQUM3QixnQkFBVSxFQUFFLENBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUU7QUFDN0QsWUFBTSxFQUFOLE1BQU0sRUFDUiIsImZpbGUiOiJldmVudHMtZGlzcGxheS13aWRnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE2IGFpeGlnbyBBR1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2xheGFyanMub3JnL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4UGF0dGVybnMgZnJvbSAnbGF4YXItcGF0dGVybnMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHRyYWNrZXIgZnJvbSAnLi90cmFja2VyJztcblxuXG5mdW5jdGlvbiBjcmVhdGUoIGNvbnRleHQsIHJlYWN0UmVuZGVyLCBmbG93U2VydmljZSApIHtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgbGV0IHNldHRpbmdHcm91cHMgPSBbICdwYXR0ZXJucycsICdpbnRlcmFjdGlvbnMnLCAnc291cmNlcycgXTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgY29udGV4dC5yZXNvdXJjZXMgPSB7fTtcblxuICAgYXhQYXR0ZXJucy5yZXNvdXJjZXMuaGFuZGxlckZvciggY29udGV4dCApLnJlZ2lzdGVyUmVzb3VyY2VGcm9tRmVhdHVyZSggJ2ZpbHRlcicsIHtcbiAgICAgIG9uVXBkYXRlUmVwbGFjZTogcnVuRmlsdGVycyxcbiAgICAgIGlzT3B0aW9uYWw6IHRydWVcbiAgIH0gKTtcblxuICAgY2xhc3MgUGF0dGVybnNIdG1sSWNvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuXG4gICAgICAgICBzd2l0Y2goIHByb3BzLm5hbWUgKSB7XG4gICAgICAgICAgICBjYXNlICdsaWZlY3ljbGUnOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtcmVjeWNsZSc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ25hdmlnYXRpb24nOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtbG9jYXRpb24tYXJyb3cnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyZXNvdXJjZXMnOlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnZmEgZmEtZmlsZS10ZXh0LW8nO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhY3Rpb25zJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLXJvY2tldCc7XG4gICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZsYWdzJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWZsYWcnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpMThuJzpcbiAgICAgICAgICAgICAgIHRoaXMuaWNvbkNsYXNzID0gJ2ZhIGZhLWdsb2JlJztcbiAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndmlzaWJpbGl0eSc6XG4gICAgICAgICAgICAgICB0aGlzLmljb25DbGFzcyA9ICdmYSBmYS1leWUnO1xuICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgdGhpcy5pY29uQ2xhc3MgPSAnJztcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17dGhpcy5pY29uQ2xhc3N9IC8+XG4gICAgICAgICApO1xuXG4gICAgICB9XG4gICB9XG5cblxuICAgbGV0IG1vZGVsID0ge1xuICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgIHsgbmFtZTogJ2xpZmVjeWNsZScsIGh0bWxJY29uOiAnPGkgY2xhc3M9XCJmYSBmYS1yZWN5Y2xlXCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICdlbmRMaWZlY3ljbGUnLCAnYmVnaW5MaWZlY3ljbGUnXG4gICAgICAgICBdIH0sXG4gICAgICAgICB7IG5hbWU6ICduYXZpZ2F0aW9uJywgaHRtbEljb246ICc8aSBjbGFzcz1cImZhIGZhLWxvY2F0aW9uLWFycm93XCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICduYXZpZ2F0ZSdcbiAgICAgICAgIF0gfSxcbiAgICAgICAgIHsgbmFtZTogJ3Jlc291cmNlcycsIGh0bWxJY29uOiAnPGkgY2xhc3M9XCJmYSBmYS1maWxlLXRleHQtb1wiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAncmVwbGFjZScsICd1cGRhdGUnLCAndmFsaWRhdGUnLCAnc2F2ZSdcbiAgICAgICAgIF0gfSxcbiAgICAgICAgIHsgbmFtZTogJ2FjdGlvbnMnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtcm9ja2V0XCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICd0YWtlQWN0aW9uJ1xuICAgICAgICAgXSB9LFxuICAgICAgICAgeyBuYW1lOiAnZmxhZ3MnLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZmxhZ1wiPjwvaT4nLCBldmVudFR5cGVzOiBbXG4gICAgICAgICAgICAnY2hhbmdlRmxhZydcbiAgICAgICAgIF0gfSxcbiAgICAgICAgIHsgbmFtZTogJ2kxOG4nLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZ2xvYmVcIj48L2k+JywgZXZlbnRUeXBlczogW1xuICAgICAgICAgICAgJ2NoYW5nZUxvY2FsZSdcbiAgICAgICAgIF0gfSxcbiAgICAgICAgIHsgbmFtZTogJ3Zpc2liaWxpdHknLCBodG1sSWNvbjogJzxpIGNsYXNzPVwiZmEgZmEtZXllXCI+PC9pPicsIGV2ZW50VHlwZXM6IFtcbiAgICAgICAgICAgICdjaGFuZ2VBcmVhVmlzaWJpbGl0eScsICdjaGFuZ2VXaWRnZXRWaXNpYmlsaXR5J1xuICAgICAgICAgXSB9LFxuICAgICAgICAgeyBuYW1lOiAnb3RoZXInLCBodG1sSWNvbjogJyZuYnNwOycsIGV2ZW50VHlwZXM6IFtdIH1cbiAgICAgIF0sXG4gICAgICBpbmRleDogMCxcbiAgICAgIGV2ZW50SW5mb3M6IFtdLFxuICAgICAgdmlzaWJsZUV2ZW50SW5mb3M6IFtdLFxuICAgICAgcHJvYmxlbVN1bW1hcnk6IHtcbiAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgZXZlbnRJbmZvczogW11cbiAgICAgIH0sXG4gICAgICBzZWxlY3Rpb25FdmVudEluZm86IG51bGwsXG4gICAgICBzZXR0aW5nczoge1xuICAgICAgICAgbmFtZVBhdHRlcm46ICcnLFxuICAgICAgICAgdmlzaWJsZUV2ZW50c0xpbWl0OiAxMDAsXG4gICAgICAgICBwYXR0ZXJuczoge30sXG4gICAgICAgICBpbnRlcmFjdGlvbnM6IHtcbiAgICAgICAgICAgIHN1YnNjcmliZTogdHJ1ZSxcbiAgICAgICAgICAgIHB1Ymxpc2g6IHRydWUsXG4gICAgICAgICAgICBkZWxpdmVyOiB0cnVlLFxuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IHRydWVcbiAgICAgICAgIH0sXG4gICAgICAgICBzb3VyY2VzOiB7XG4gICAgICAgICAgICB3aWRnZXRzOiB0cnVlLFxuICAgICAgICAgICAgcnVudGltZTogdHJ1ZVxuICAgICAgICAgfVxuICAgICAgfVxuICAgfTtcblxuICAgY29uc3QgdmlldyA9IHtcbiAgICAgIHNob3dQYXR0ZXJuczogZmFsc2VcbiAgIH07XG5cbiAgIGxldCBjb21tYW5kcyA9IHtcbiAgICAgIHNldEFsbDogZnVuY3Rpb24oIHRvVmFsdWUgKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1sgZ3JvdXBOYW1lIF07XG4gICAgICAgICAgICBmb3IoIGxldCBuYW1lIGluIGdyb3VwICkge1xuICAgICAgICAgICAgICAgaWYoIGdyb3VwLmhhc093blByb3BlcnR5WyBuYW1lIF0gKSB7XG4gICAgICAgICAgICAgICAgICBncm91cFsgbmFtZSBdID0gdG9WYWx1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgIH0sXG4gICAgICBzZXREZWZhdWx0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICBzZXR0aW5nR3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cE5hbWUgKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBtb2RlbC5zZXR0aW5nc1sgZ3JvdXBOYW1lIF07XG4gICAgICAgICAgICBmb3IoIGxldCBuYW1lIGluIGdyb3VwICkge1xuICAgICAgICAgICAgICAgaWYoIGdyb3VwLmhhc093blByb3BlcnR5WyBuYW1lIF0gKSB7XG4gICAgICAgICAgICAgICAgICBncm91cFsgbmFtZSBdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0gKTtcbiAgICAgICAgIG1vZGVsLnBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuSW5mbyApIHtcbiAgICAgICAgICAgIG1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuSW5mby5uYW1lIF0gPSB0cnVlO1xuICAgICAgICAgfSApO1xuICAgICAgICAgY29udGV4dC5mZWF0dXJlcy5maWx0ZXIuaGlkZVBhdHRlcm5zLmZvckVhY2goIGZ1bmN0aW9uKCBwYXR0ZXJuICkge1xuICAgICAgICAgICAgbW9kZWwuc2V0dGluZ3MucGF0dGVybnNbIHBhdHRlcm4gXSA9IGZhbHNlO1xuICAgICAgICAgfSApO1xuICAgICAgICAgY29udGV4dC5mZWF0dXJlcy5maWx0ZXIuaGlkZVNvdXJjZXMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICBtb2RlbC5zZXR0aW5ncy5zb3VyY2VzWyBwYXR0ZXJuIF0gPSBmYWxzZTtcbiAgICAgICAgIH0gKTtcbiAgICAgICAgIGNvbnRleHQuZmVhdHVyZXMuZmlsdGVyLmhpZGVJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICBtb2RlbC5zZXR0aW5ncy5pbnRlcmFjdGlvbnNbIHBhdHRlcm4gXSA9IGZhbHNlO1xuICAgICAgICAgfSApO1xuICAgICAgfSxcbiAgICAgIGNsZWFyRmlsdGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICBtb2RlbC5zZXR0aW5ncy5uYW1lUGF0dGVybiA9ICcnO1xuICAgICAgICAgbW9kZWwuc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ID0gbnVsbDtcbiAgICAgICAgIGNvbnRleHQuY29tbWFuZHMuc2V0QWxsKCB0cnVlICk7XG4gICAgICB9LFxuICAgICAgLy8gc2VsZWN0OiBmdW5jdGlvbiggZXZlbnRJbmZvICkge1xuICAgICAgLy8gICAgbW9kZWwuc2VsZWN0aW9uRXZlbnRJbmZvID0gZXZlbnRJbmZvLnNlbGVjdGVkID8gbnVsbCA6IGV2ZW50SW5mbztcbiAgICAgIC8vICAgIHJ1bkZpbHRlcnMoKTtcbiAgICAgIC8vIH0sXG4gICAgICBkaXNjYXJkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgIG1vZGVsLmV2ZW50SW5mb3MgPSBbXTtcbiAgICAgICAgIG1vZGVsLnNlbGVjdGlvbkV2ZW50SW5mbyA9IG51bGw7XG4gICAgICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICAgICByZWZyZXNoUHJvYmxlbVN1bW1hcnkoKTtcbiAgICAgIH0sXG4gICAgICBydW5GaWx0ZXJzOiBydW5GaWx0ZXJzXG4gICB9O1xuXG4gICBjb21tYW5kcy5zZXREZWZhdWx0cygpO1xuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBpZiggY29udGV4dC5mZWF0dXJlcy5ldmVudHMuc3RyZWFtICkge1xuICAgICAgY29udGV4dC5ldmVudEJ1cy5zdWJzY3JpYmUoICdkaWRQcm9kdWNlLicgKyBjb250ZXh0LmZlYXR1cmVzLmV2ZW50cy5zdHJlYW0sIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgIGlmKCBBcnJheS5pc0FycmF5KCBldmVudC5kYXRhICkgJiYgZXZlbnQuZGF0YS5sZW5ndGggKSB7XG4gICAgICAgICAgICBldmVudC5kYXRhLmZvckVhY2goIGFkZEV2ZW50ICk7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFkZEV2ZW50KCBldmVudC5kYXRhICk7XG4gICAgICAgICB9XG4gICAgICAgICBydW5GaWx0ZXJzKCk7XG4gICAgICB9ICk7XG4gICB9XG5cbiAgIC8vY29udGV4dC4kd2F0Y2goICdtb2RlbC5zZXR0aW5ncycsIHJ1bkZpbHRlcnMsIHRydWUgKTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gYWRkRXZlbnQoIGV2ZW50SW5mbyApIHtcblxuICAgICAgbGV0IGNvbXBsZXRlRXZlbnRJbmZvID0ge1xuICAgICAgICAgaW5kZXg6ICsrbW9kZWwuaW5kZXgsXG4gICAgICAgICBpbnRlcmFjdGlvbjogZXZlbnRJbmZvLmFjdGlvbixcbiAgICAgICAgIGN5Y2xlSWQ6IGV2ZW50SW5mby5jeWNsZUlkID4gLTEgPyBldmVudEluZm8uY3ljbGVJZCA6ICctJyxcbiAgICAgICAgIGV2ZW50T2JqZWN0OiBldmVudEluZm8uZXZlbnRPYmplY3QgfHwge30sXG4gICAgICAgICBmb3JtYXR0ZWRFdmVudDogSlNPTi5zdHJpbmdpZnkoIGV2ZW50SW5mby5ldmVudE9iamVjdCwgbnVsbCwgMyApLFxuICAgICAgICAgZm9ybWF0dGVkVGltZToge1xuICAgICAgICAgICAgdXBwZXI6IG1vbWVudCggZXZlbnRJbmZvLnRpbWUgKS5mb3JtYXQoICdISDptbScgKSxcbiAgICAgICAgICAgIGxvd2VyOiBtb21lbnQoIGV2ZW50SW5mby50aW1lICkuZm9ybWF0KCAnc3MuU1NTJyApXG4gICAgICAgICB9LFxuICAgICAgICAgbmFtZTogZXZlbnRJbmZvLmV2ZW50IHx8ICc/JyxcbiAgICAgICAgIHBhdHRlcm46IHBhdHRlcm4oIChldmVudEluZm8uZXZlbnQgfHwgJz8nKS50b0xvd2VyQ2FzZSgpICksXG4gICAgICAgICBzaG93RGV0YWlsczogZmFsc2UsXG4gICAgICAgICBzb3VyY2U6ICggZXZlbnRJbmZvLnNvdXJjZSB8fCAnPycgKS5yZXBsYWNlKCAvXndpZGdldFxcLi8sICcnICksXG4gICAgICAgICB0YXJnZXQ6ICggZXZlbnRJbmZvLnRhcmdldCB8fCAnPycgKS5yZXBsYWNlKCAvXi0kLywgJycgKSxcbiAgICAgICAgIHRpbWU6IGV2ZW50SW5mby50aW1lLFxuICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgc291cmNlVHlwZTogKCBldmVudEluZm8uc291cmNlIHx8ICc/JyApLmluZGV4T2YoICd3aWRnZXQuJyApID09PSAwID8gJ3dpZGdldHMnIDogJ3J1bnRpbWUnLFxuICAgICAgICAgcHJvYmxlbXM6IHRyYWNrZXIudHJhY2soIGV2ZW50SW5mbyApXG4gICAgICB9O1xuXG4gICAgICBtb2RlbC5ldmVudEluZm9zLnVuc2hpZnQoIGNvbXBsZXRlRXZlbnRJbmZvICk7XG4gICAgICBpZiggY29tcGxldGVFdmVudEluZm8ucHJvYmxlbXMubGVuZ3RoICkge1xuICAgICAgICAgcmVmcmVzaFByb2JsZW1TdW1tYXJ5KCk7XG4gICAgICB9XG5cbiAgICAgIGlmKCBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCA+IGNvbnRleHQuZmVhdHVyZXMuZXZlbnRzLmJ1ZmZlclNpemUgKSB7XG4gICAgICAgICBsZXQgcmVtb3ZlZEluZm8gPSBtb2RlbC5ldmVudEluZm9zLnBvcCgpO1xuICAgICAgICAgaWYoIHJlbW92ZWRJbmZvLnByb2JsZW1zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwYXR0ZXJuKCBldmVudE5hbWUgKSB7XG4gICAgICAgICBsZXQgbWF0Y2hpbmdQYXR0aGVybiA9IG1vZGVsLnBhdHRlcm5zLmZpbHRlciggZnVuY3Rpb24oIHBhdHRlcm4gKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0dGVybi5ldmVudFR5cGVzLnNvbWUoIGZ1bmN0aW9uKCBldmVudFR5cGUgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gZXZlbnROYW1lLmluZGV4T2YoIGV2ZW50VHlwZS50b0xvd2VyQ2FzZSgpICkgIT09IC0xO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgfSApO1xuICAgICAgICAgcmV0dXJuIG1hdGNoaW5nUGF0dGhlcm4ubGVuZ3RoID8gbWF0Y2hpbmdQYXR0aGVyblsgMCBdLm5hbWUgOiAnb3RoZXInO1xuICAgICAgfVxuXG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlZnJlc2hQcm9ibGVtU3VtbWFyeSgpIHtcbiAgICAgIGxldCBldmVudEluZm9zID0gbW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBpbmZvICkge1xuICAgICAgICAgcmV0dXJuIGluZm8ucHJvYmxlbXMubGVuZ3RoID4gMDtcbiAgICAgIH0gKTtcblxuICAgICAgbW9kZWwucHJvYmxlbVN1bW1hcnkgPSB7XG4gICAgICAgICBoYXNQcm9ibGVtczogZXZlbnRJbmZvcy5sZW5ndGggPiAwLFxuICAgICAgICAgZXZlbnRJbmZvczogZXZlbnRJbmZvc1xuICAgICAgfTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcnVuRmlsdGVycygpIHtcbiAgICAgIGxldCBzZXR0aW5ncyA9IG1vZGVsLnNldHRpbmdzO1xuICAgICAgbGV0IG51bVZpc2libGUgPSAwO1xuXG4gICAgICBsZXQgc2VhcmNoUmVnRXhwID0gbnVsbDtcbiAgICAgIGlmKCBzZXR0aW5ncy5uYW1lUGF0dGVybiApIHtcbiAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZWFyY2hSZWdFeHAgPSBuZXcgUmVnRXhwKCBzZXR0aW5ncy5uYW1lUGF0dGVybiwgJ2dpJyApO1xuICAgICAgICAgfVxuICAgICAgICAgY2F0Y2goIGUgKSB7IC8qIGlnbm9yZSBpbnZhbGlkIHNlYXJjaCBwYXR0ZXJuICovIH1cbiAgICAgIH1cbiAgICAgIGxldCBzZWxlY3Rpb25FdmVudEluZm8gPSBtb2RlbC5zZWxlY3Rpb25FdmVudEluZm87XG5cbiAgICAgIG1vZGVsLnZpc2libGVFdmVudEluZm9zID0gbW9kZWwuZXZlbnRJbmZvcy5maWx0ZXIoIGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICBpZiggc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICE9PSBudWxsICYmIG51bVZpc2libGUgPj0gc2V0dGluZ3MudmlzaWJsZUV2ZW50c0xpbWl0ICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5pbnRlcmFjdGlvbnNbIGV2ZW50SW5mby5pbnRlcmFjdGlvbiBdICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfVxuICAgICAgICAgaWYoICFzZXR0aW5ncy5wYXR0ZXJuc1sgZXZlbnRJbmZvLnBhdHRlcm4gXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhc2V0dGluZ3Muc291cmNlc1sgZXZlbnRJbmZvLnNvdXJjZVR5cGUgXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc0ZpbHRlclJlc291cmNlKCBldmVudEluZm8gKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmKCAhbWF0Y2hlc1NlYXJjaEV4cHJlc3Npb24oIGV2ZW50SW5mbywgc2VhcmNoUmVnRXhwICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICB9XG4gICAgICAgICArK251bVZpc2libGU7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gKTtcblxuICAgICAgLy8gbW9kaWZ5IG1hdGNoZXMgaW4gcGxhY2VcbiAgICAgIG1vZGVsLnZpc2libGVFdmVudEluZm9zLmZvckVhY2goIGZ1bmN0aW9uKCBldmVudEluZm8gKSB7XG4gICAgICAgICBldmVudEluZm8uaHRtbE5hbWUgPSBodG1sVmFsdWUoIGV2ZW50SW5mby5uYW1lLCBzZWFyY2hSZWdFeHAsICcuJyApO1xuICAgICAgICAgZXZlbnRJbmZvLmh0bWxTb3VyY2UgPSBodG1sVmFsdWUoIGV2ZW50SW5mby5zb3VyY2UsIHNlYXJjaFJlZ0V4cCwgJyMnICk7XG4gICAgICAgICBldmVudEluZm8uaHRtbFRhcmdldCA9IGh0bWxWYWx1ZSggZXZlbnRJbmZvLnRhcmdldCwgc2VhcmNoUmVnRXhwLCAnIycgKTtcbiAgICAgICAgIGV2ZW50SW5mby5zZWxlY3RlZCA9ICEhc2VsZWN0aW9uRXZlbnRJbmZvICYmIGluU2VsZWN0aW9uKCBldmVudEluZm8sIHNlbGVjdGlvbkV2ZW50SW5mbyApO1xuICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiBtYXRjaGVzU2VhcmNoRXhwcmVzc2lvbiggZXZlbnRJbmZvLCBzZWFyY2hSZWdFeHAgKSB7XG4gICAgICByZXR1cm4gIXNlYXJjaFJlZ0V4cCB8fCBbIGV2ZW50SW5mby5uYW1lLCBldmVudEluZm8uc291cmNlLCBldmVudEluZm8udGFyZ2V0IF1cbiAgICAgICAgIC5zb21lKCBmdW5jdGlvbiggZmllbGQgKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2hlcyA9IHNlYXJjaFJlZ0V4cC50ZXN0KCBmaWVsZCApO1xuICAgICAgICAgICAgc2VhcmNoUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gISFtYXRjaGVzO1xuICAgICAgICAgfSApO1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBsZXQgcGF0dGVyblRvcGljcyA9IHtcbiAgICAgIFJFU09VUkNFOiBbICdkaWRSZXBsYWNlJywgJ2RpZFVwZGF0ZScgXSxcbiAgICAgIEFDVElPTjogWyAndGFrZUFjdGlvblJlcXVlc3QnLCAnd2lsbFRha2VBY3Rpb24nLCAnZGlkVGFrZUFjdGlvbicgXSxcbiAgICAgIEZMQUc6IFsgJ2RpZENoYW5nZUZsYWcnIF0sXG4gICAgICBDT05UQUlORVI6IFsgJ2NoYW5nZUFyZWFWaXNpYmlsaXR5UmVxdWVzdCcsICd3aWxsQ2hhbmdlQXJlYVZpc2liaWxpdHknLCAnZGlkQ2hhbmdlQXJlYVZpc2liaWxpdHknIF1cbiAgIH07XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIG1hdGNoZXNGaWx0ZXJSZXNvdXJjZSggZXZlbnRJbmZvICkge1xuICAgICAgaWYoICFjb250ZXh0LnJlc291cmNlcy5maWx0ZXIgKSB7XG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGZpbHRlclRvcGljcyA9IGNvbnRleHQucmVzb3VyY2VzLmZpbHRlci50b3BpY3MgfHwgW107XG4gICAgICBsZXQgZmlsdGVyUGFydGljaXBhbnRzID0gY29udGV4dC5yZXNvdXJjZXMuZmlsdGVyLnBhcnRpY2lwYW50cyB8fCBbXTtcbiAgICAgIGlmKCAhZmlsdGVyVG9waWNzLmxlbmd0aCAmJiAhZmlsdGVyUGFydGljaXBhbnRzLmxlbmd0aCApIHtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgbWF0Y2hlc1RvcGljRmlsdGVyID0gZmlsdGVyVG9waWNzXG4gICAgICAgICAuc29tZSggZnVuY3Rpb24oIGl0ZW0gKSB7XG4gICAgICAgICAgICBsZXQgcHJlZml4ZXMgPSBwYXR0ZXJuVG9waWNzWyBpdGVtLnBhdHRlcm4gXTtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlcy5zb21lKCBmdW5jdGlvbiggcHJlZml4ICkge1xuICAgICAgICAgICAgICAgbGV0IHRvcGljID0gcHJlZml4ICsgJy4nICsgaXRlbS50b3BpYztcbiAgICAgICAgICAgICAgIHJldHVybiBldmVudEluZm8ubmFtZSA9PT0gdG9waWMgfHwgZXZlbnRJbmZvLm5hbWUuaW5kZXhPZiggdG9waWMgKyAnLicgKSA9PT0gMDtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgIH0gKTtcblxuICAgICAgbGV0IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXIgPSBbICd0YXJnZXQnLCAnc291cmNlJyBdLnNvbWUoIGZ1bmN0aW9uKCBmaWVsZCApIHtcbiAgICAgICAgIGxldCB2YWx1ZSA9IGV2ZW50SW5mb1sgZmllbGQgXTtcbiAgICAgICAgIHJldHVybiBmaWx0ZXJQYXJ0aWNpcGFudHNcbiAgICAgICAgICAgIC5tYXAoIGZ1bmN0aW9uKCBfICkgeyByZXR1cm4gXy5wYXJ0aWNpcGFudDsgfSApXG4gICAgICAgICAgICAuc29tZSggaXNTdWZmaXhPZiggdmFsdWUgKSApO1xuICAgICAgfSApO1xuXG4gICAgICByZXR1cm4gbWF0Y2hlc1RvcGljRmlsdGVyIHx8IG1hdGNoZXNQYXJ0aWNpcGFudHNGaWx0ZXI7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgIGZ1bmN0aW9uIGlzU3VmZml4T2YoIHZhbHVlICkge1xuICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBfICkge1xuICAgICAgICAgICAgbGV0IHRhaWwgPSAnIycgKyBfO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSB0YWlsLmxlbmd0aCAmJiB2YWx1ZS5pbmRleE9mKCB0YWlsICkgPT09IHZhbHVlLmxlbmd0aCAtIHRhaWwubGVuZ3RoO1xuICAgICAgICAgfTtcbiAgICAgIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaHRtbFZhbHVlKCB2YWx1ZSwgc2VhcmNoUmVnRXhwLCBzcGxpdENoYXJhY3RlciApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIC8vIGxldCBodG1sID0gJHNhbml0aXplKCB2YWx1ZSApO1xuICAgICAgLy8gbGV0IHdhc1NwbGl0ID0gZmFsc2U7XG4gICAgICAvLyBpZiggIXNlYXJjaFJlZ0V4cCApIHtcbiAgICAgIC8vICAgIHJldHVybiB3cmFwKCBzcGxpdCggaHRtbCwgZmFsc2UgKSApO1xuICAgICAgLy8gfVxuICAgICAgLy9cbiAgICAgIC8vIGxldCBwYXJ0cyA9IFtdO1xuICAgICAgLy8gbGV0IG1hdGNoO1xuICAgICAgLy8gbGV0IGxhc3RJbmRleCA9IDA7XG4gICAgICAvLyBsZXQgbGltaXQgPSAxO1xuICAgICAgLy8gd2hpbGUoIGxpbWl0LS0gJiYgKCBtYXRjaCA9IHNlYXJjaFJlZ0V4cC5leGVjKCBodG1sICkgKSAhPT0gbnVsbCApIHtcbiAgICAgIC8vICAgIGlmKCBtYXRjaC5pbmRleCA+IGxhc3RJbmRleCApIHtcbiAgICAgIC8vICAgICAgIHBhcnRzLnB1c2goIHNwbGl0KCBodG1sLnN1YnN0cmluZyggbGFzdEluZGV4LCBtYXRjaC5pbmRleCApLCBmYWxzZSApICk7XG4gICAgICAvLyAgICB9XG4gICAgICAvLyAgICBwYXJ0cy5wdXNoKCAnPGI+JyApO1xuICAgICAgLy8gICAgcGFydHMucHVzaCggc3BsaXQoIG1hdGNoWyAwIF0sIHRydWUgKSApO1xuICAgICAgLy8gICAgcGFydHMucHVzaCggJzwvYj4nICk7XG4gICAgICAvLyAgICBsYXN0SW5kZXggPSBzZWFyY2hSZWdFeHAubGFzdEluZGV4O1xuICAgICAgLy8gfVxuICAgICAgLy8gc2VhcmNoUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgICAvLyBwYXJ0cy5wdXNoKCBzcGxpdCggaHRtbC5zdWJzdHJpbmcoIGxhc3RJbmRleCwgaHRtbC5sZW5ndGggKSApICk7XG4gICAgICAvLyByZXR1cm4gd3JhcCggcGFydHMuam9pbiggJycgKSApO1xuICAgICAgLy9cbiAgICAgIC8vIGZ1bmN0aW9uIHdyYXAoIHdob2xlICkge1xuICAgICAgLy8gICAgcmV0dXJuICc8c3Bhbj4nICsgd2hvbGUgKyAnPC9zcGFuPic7XG4gICAgICAvLyB9XG4gICAgICAvL1xuICAgICAgLy8gZnVuY3Rpb24gc3BsaXQoIHBhcnQsIGlzQm9sZCApIHtcbiAgICAgIC8vICAgIGlmKCAhc3BsaXRDaGFyYWN0ZXIgfHwgd2FzU3BsaXQgKSB7XG4gICAgICAvLyAgICAgICByZXR1cm4gcGFydDtcbiAgICAgIC8vICAgIH1cbiAgICAgIC8vXG4gICAgICAvLyAgICBsZXQgc3BsaXRQb2ludCA9IHBhcnQuaW5kZXhPZiggc3BsaXRDaGFyYWN0ZXIgKTtcbiAgICAgIC8vICAgIGlmKCBzcGxpdFBvaW50ID09PSAtMSApIHtcbiAgICAgIC8vICAgICAgIHJldHVybiBwYXJ0O1xuICAgICAgLy8gICAgfVxuICAgICAgLy9cbiAgICAgIC8vICAgIHdhc1NwbGl0ID0gdHJ1ZTtcbiAgICAgIC8vICAgIHJldHVybiBwYXJ0LnN1YnN0cmluZyggMCwgc3BsaXRQb2ludCApICtcbiAgICAgIC8vICAgICAgICggaXNCb2xkID8gJzwvYj4nIDogJycgKSArICc8L3NwYW4+PGJyIC8+PHNwYW4+JyArICggaXNCb2xkID8gJzxiPicgOiAnJyApICtcbiAgICAgIC8vICAgICAgIHBhcnQuc3Vic3RyaW5nKCBzcGxpdFBvaW50ICsgMSwgcGFydC5sZW5ndGggKTtcbiAgICAgIC8vIH1cbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gaW5TZWxlY3Rpb24oIGV2ZW50SW5mbywgc2VsZWN0aW9uRXZlbnRJbmZvICkge1xuICAgICAgaWYoICFzZWxlY3Rpb25FdmVudEluZm8gKSB7XG4gICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBldmVudEluZm8gPT09IHNlbGVjdGlvbkV2ZW50SW5mbyB8fCAoXG4gICAgICAgICBldmVudEluZm8uY3ljbGVJZCA9PT0gc2VsZWN0aW9uRXZlbnRJbmZvLmN5Y2xlSWQgJiZcbiAgICAgICAgIGV2ZW50SW5mby5zb3VyY2UgPT09IHNlbGVjdGlvbkV2ZW50SW5mby5zb3VyY2UgJiZcbiAgICAgICAgIGV2ZW50SW5mby5uYW1lID09PSBzZWxlY3Rpb25FdmVudEluZm8ubmFtZVxuICAgICAgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gc2VwYXJhdGUoIGxhYmVsLCBzZXBhcmF0b3IsIGRlZmF1bHRUZXh0ICkge1xuICAgICAgbGV0IG5hbWUgPSBsYWJlbCB8fCBkZWZhdWx0VGV4dDtcbiAgICAgIGxldCBzcGxpdFBvaW50ID0gbmFtZS5pbmRleE9mKCBzZXBhcmF0b3IgKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICB1cHBlcjogc3BsaXRQb2ludCA9PT0gLTEgPyBuYW1lIDogbmFtZS5zdWJzdHIoIDAsIHNwbGl0UG9pbnQgKSxcbiAgICAgICAgIGxvd2VyOiBzcGxpdFBvaW50ID09PSAtMSA/IGRlZmF1bHRUZXh0IDogbmFtZS5zdWJzdHIoIHNwbGl0UG9pbnQsIG5hbWUubGVuZ3RoIClcbiAgICAgIH07XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcblxuXG4gICAgICBmdW5jdGlvbiBhZmZpeCgpIHtcbiAgICAgICAgIHJldHVybiAoIDxkaXY+PHA+YWZmaXggY2FsbGluZzwvcD48L2Rpdj4gKTtcbiAgICAgICAgIC8qXG4gICAgICAgICBjb25zdCBldmVudEluZm9MaXN0ID0gbW9kZWwucHJvYmxlbVN1bW1hcnkuZXZlbnRJbmZvcy5tYXAoICggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgPGxpIGtleT17ZXZlbnQubmFtZX0+XG4gICAgICAgICAgICAgICAgICA8aDU+PHN0cm9uZz57IGV2ZW50Lm5hbWUgfTwvc3Ryb25nPiA8ZW0+KHNvdXJjZTogeyBldmVudC5zb3VyY2UgfSk8L2VtPjwvaDU+XG4gICAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcm9ibGVtcy5tYXAoICggcHJvYmxlbXMgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17cHJvYmxlbS5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJheC1ldmVudC1wcm9ibGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS13YXJuaW5nIGF4LWVycm9yXCIvPiB7IHByb2JsZW0uZGVzY3JpcHRpb24gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKVxuICAgICAgICAgfSApO1xuXG4gICAgICAgICBjbGFzcyBGaWx0ZXJzRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHRoaXMucHJvcHMubmFtZX07XG5cbiAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCggdGhpcyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoYW5kbGVDaGFuZ2UoIGV2ZW50ICkge1xuICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSgge3ZhbHVlOiBldmVudC50YXJnZXQudmFsdWV9ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBheC1mb3I9XCInc2VhcmNoJ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPkZpbHRlcnM6PC9zbWFsbD5cbiAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCAoUmVnRXhwKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXgtaWQ9XCInc2VhcmNoJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgY29uc3QgZmlsdGVycyA9IDxGaWx0ZXJzRm9ybSBuYW1lPVwibW9kZWwuc2V0dGluZ3MubmFtZVBhdHRlcm5cIi8+O1xuXG4gICAgICAgICBjb25zdCBsaW1pdCA9IChcbiAgICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICAgPGxhYmVsIGF4LWZvcj1cIidsaW1pdCdcIj5cbiAgICAgICAgICAgICAgICAgIDxzbWFsbD5MaW1pdDo8L3NtYWxsPlxuICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIlxuICAgICAgICAgICAgICAgICAgICAgIGF4LWlkPVwiJ2xpbWl0J1wiXG4gICAgICAgICAgICAgICAgICAgICAgbmctbW9kZWw9XCJtb2RlbC5zZXR0aW5ncy52aXNpYmxlRXZlbnRzTGltaXRcIlxuICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsLW9wdGlvbnM9XCJ7IHVwZGF0ZU9uOiAnZGVmYXVsdCcgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgYXgtaW5wdXQ9XCJpbnRlZ2VyXCJcbiAgICAgICAgICAgICAgICAgICAgICBheC1pbnB1dC1taW5pbXVtLXZhbHVlPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgYXgtaW5wdXQtbWF4aW11bS12YWx1ZT1cImZlYXR1cmVzLmV2ZW50cy5idWZmZXJTaXplXCJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjAte3sgZmVhdHVyZXMuZXZlbnRzLmJ1ZmZlclNpemUgfX1cIlxuICAgICAgICAgICAgICAgICAgICAgIG1heGxlbmd0aD1cIjRcIi8+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICApO1xuICAgICAgICAgcmV0dXJuIHtmaWx0ZXJzfTtcbiAgICAgICovXG4gICAgICAvKiAgIGNvbnN0IGZpbHRlck1lbnUgPSAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc21cIlxuICAgICAgICAgICAgICAgICBuZy1jbGFzc05hbWU9XCJ7ICdvcGVuJzogdmlldy5zaG93UGF0dGVybnMgfVwiXG4gICAgICAgICAgICAgICAgIG5nLW1vdXNlZW50ZXI9XCJ2aWV3LnNob3dQYXR0ZXJucyA9IHRydWVcIlxuICAgICAgICAgICAgICAgICBuZy1tb3VzZWxlYXZlPVwidmlldy5zaG93UGF0dGVybnMgPSBmYWxzZVwiPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPVwie3sgdmlldy5zaG93UGF0dGVybnMgfX1cIj5cbiAgICAgICAgICAgICAgICAgIE1vcmUgPHNwYW4gY2xhc3NOYW1lPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudSBjb250YWluZXIgY29sLWxnLTZcIiByb2xlPVwibWVudVwiPlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgZmlyc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoND5QYXR0ZXJuczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cInBhdHRlcm4gaW4gbW9kZWwucGF0dGVybnMgdHJhY2sgYnkgcGF0dGVybi5uYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cIm1vZGVsLnNldHRpbmdzLnBhdHRlcm5zWyBwYXR0ZXJuLm5hbWUgXSA9ICFtb2RlbC5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBhdHRlcm5cIiBuZy1iaW5kLWh0bWw9XCJwYXR0ZXJuLmh0bWxJY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgcGF0dGVybi5uYW1lIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBwdWxsLXJpZ2h0IGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzPVwieyAnZmEtdG9nZ2xlLW9mZic6ICFtb2RlbC5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF0sICdmYS10b2dnbGUtb24nOiBtb2RlbC5zZXR0aW5ncy5wYXR0ZXJuc1sgcGF0dGVybi5uYW1lIF0gfVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgbGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGg0PkludGVyYWN0aW9uczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cIihpbnRlcmFjdGlvbiwgZW5hYmxlZCkgaW4gbW9kZWwuc2V0dGluZ3MuaW50ZXJhY3Rpb25zIHRyYWNrIGJ5IGludGVyYWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tbGluayBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cIm1vZGVsLnNldHRpbmdzLmludGVyYWN0aW9uc1sgaW50ZXJhY3Rpb24gXSA9ICFlbmFibGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID57eyBpbnRlcmFjdGlvbiB9fTxpIGNsYXNzTmFtZT1cImZhIHB1bGwtcmlnaHQgYXgtZXZlbnQtc2V0dGluZy10b2dnbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzTmFtZT1cInsgJ2ZhLXRvZ2dsZS1vZmYnOiAhZW5hYmxlZCwgJ2ZhLXRvZ2dsZS1vbic6IGVuYWJsZWQgfVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoND5Tb3VyY2VzPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVwiKHNvdXJjZSwgZW5hYmxlZCkgaW4gbW9kZWwuc2V0dGluZ3Muc291cmNlcyB0cmFjayBieSBzb3VyY2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1saW5rIGF4LWV2ZW50LXNldHRpbmctdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsaWNrPVwibW9kZWwuc2V0dGluZ3Muc291cmNlc1sgc291cmNlIF0gPSAhZW5hYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+e3sgc291cmNlIH19PGkgY2xhc3NOYW1lPVwiZmEgcHVsbC1yaWdodCBheC1ldmVudC1zZXR0aW5nLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XCJ7ICdmYS10b2dnbGUtb2ZmJzogIWVuYWJsZWQsICdmYS10b2dnbGUtb24nOiBlbmFibGVkIH1cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1ldmVudC1zZXR0aW5ncy1jb2wgZmlyc3RcIj4mbmJzcDs8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtZXZlbnQtc2V0dGluZ3MtY29sIGxhc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4tcHJpbWFyeVwiIG5nLWNsaWNrPVwiY29tbWFuZHMuc2V0QWxsKCB0cnVlIClcIj5BbGwgT248L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHMgYnRuLXByaW1hcnlcIiBuZy1jbGljaz1cImNvbW1hbmRzLnNldEFsbCggZmFsc2UgKVwiPkFsbCBPZmY8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4teHNcIiBuZy1jbGljaz1cImNvbW1hbmRzLnNldERlZmF1bHRzKClcIj5EZWZhdWx0czwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgKTsqL1xuXG4gICAgICAgLyogIHJldHVyblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJheC1hZmZpeC1hcmVhXCJcbiAgICAgICAgICAgICAgICAgYXgtYWZmaXhcbiAgICAgICAgICAgICAgICAgYXgtYWZmaXgtb2Zmc2V0LXRvcD1cIjEwMFwiPlxuICAgICAgICAgICAgICAgeyAhbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj5FbXB0eSBFdmVudHMgTGlzdDwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxpIGNsYXNzTmFtZT1cImZhIGZhLWNsb2NrLW9cIj48L2k+IFdhaXRpbmcgZm9yIGV2ZW50cyBmcm9tIGhvc3QgYXBwbGljYXRpb24uLi48L3A+XG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgeyBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCAmJiAhbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+MC97IG1vZGVsLmV2ZW50SW5mb3MubGVuZ3RoIH0gRXZlbnQgSXRlbXM8L2g0PlxuICAgICAgICAgICAgICAgICAgICA8cD5ObyBldmVudHMgbWF0Y2hpbmcgY3VycmVudCBmaWx0ZXJzLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz1cImNvbW1hbmRzLmNsZWFyRmlsdGVyc1wiPlNob3cgQWxsPC9idXR0b24+PC9wPlxuICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgeyBtb2RlbC5wcm9ibGVtU3VtbWFyeS5oYXNQcm9ibGVtcyAmJlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxhcmdlXCI+XG4gICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5IGF4LWVycm9yXCI+eyBtb2RlbC5wcm9ibGVtU3VtbWFyeS5ldmVudEluZm9zLmxlbmd0aCB9L3sgbW9kZWwuZXZlbnRJbmZvcy5sZW5ndGggfSBFdmVudHMgd2l0aCBQcm9ibGVtczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICA8dWw+e2V2ZW50SW5mb0xpc3R9PC91bD5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbXMtZXhwbGFuYXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgRXZlbnRzIHdpdGggcHJvYmxlbXMgYXJlIG1hcmtlZCA8c3Ryb25nIGNsYXNzTmFtZT1cImF4LWVycm9yXCI+cmVkPC9zdHJvbmc+IGluIHRoZSBldmVudHMgdGFibGUuXG4gICAgICAgICAgICAgICAgICAgICAgIEZpbHRlciBieSBldmVudC9zb3VyY2UgYXMgbmVlZGVkLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgeyBtb2RlbC52aXNpYmxlRXZlbnRJbmZvcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sYXJnZVwiPlxuICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeVwiPnsgbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubGVuZ3RoIH0veyBtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9IEV2ZW50czwvaDQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXgtYnV0dG9uLXdyYXBwZXIgZm9ybS1pbmxpbmVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtXCI+XG4gICAgICAgICAgICAgICAgICAgICB7ZmlsdGVyc31cbiAgICAgICAgICAgICAgICAgICAgIHtsaW1pdH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG5cbiAgICAgICAgICAgICAgICAgIHtmaWx0ZXJNZW51fVxuXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc21cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XCJ7ICdheC1kaXNhYmxlZCc6ICFtb2RlbC5ldmVudEluZm9zLmxlbmd0aCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xpY2s9XCJjb21tYW5kcy5kaXNjYXJkKClcIj5EaXNjYXJkIEV2ZW50czwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1pbmxpbmUgZXZlbnRzLWRpc3BsYXktZmlsdGVyLWl0ZW1zXCIgbmctaWY9XCJyZXNvdXJjZXMuZmlsdGVyLnRvcGljcy5sZW5ndGggfHwgcmVzb3VyY2VzLmZpbHRlci5wYXJ0aWNpcGFudHMubGVuZ3RoXCI+XG4gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGJ0bi1saW5rXCIgaHJlZj1cIiMvdG9vbHMvcGFnZVwiPlBhZ2Ugc2VsZWN0aW9uPC9hPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBidG4taW5mb1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XCJpdGVtIGluIHJlc291cmNlcy5maWx0ZXIudG9waWNzIHRyYWNrIGJ5IGl0ZW0udG9waWNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3NOYW1lPVwiJ2F4LWV2ZW50cy1kaXNwbGF5LXBhdHRlcm4tJyArIGl0ZW0ucGF0dGVyblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3tpdGVtLnRvcGljfX1cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj48c3BhbiBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGJ0bi1pbmZvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cIml0ZW0gaW4gcmVzb3VyY2VzLmZpbHRlci5wYXJ0aWNpcGFudHMgdHJhY2sgYnkgaXRlbS5wYXJ0aWNpcGFudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGFzc05hbWU9XCInYXgtZXZlbnRzLWRpc3BsYXkta2luZC0nICsgaXRlbS5raW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7e2l0ZW0ucGFydGljaXBhbnR9fVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj4qL1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICBmdW5jdGlvbiBldmVudExpc3RUYWJsZSgpIHtcbiAgICAgICAgIGlmKCAhbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuIDxwPm5vIGV2ZW50czwvcD47XG4gICAgICAgICB9XG5cbiAgICAgICAgIC8vIHsvKmNsYXNzIHRib2R5RXZlbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQgeyovfVxuICAgICAgICAgLy8gICAgey8qY29uc3RydWN0b3IocHJvcHMpIHsqL31cbiAgICAgICAgIC8vICAgICAgIHsvKnN1cGVyKHByb3BzKTsqL31cbiAgICAgICAgIC8vICAgICAgIHsvKnRoaXMuZXZlbnQgPSB0aGlzLmV2ZW50cyovfVxuICAgICAgICAgLy9cbiAgICAgICAgIC8vICAgICAgIHsvKi8vIFRoaXMgYmluZGluZyBpcyBuZWNlc3NhcnkgdG8gbWFrZSBgdGhpc2Agd29yayBpbiB0aGUgY2FsbGJhY2sqL31cbiAgICAgICAgIC8vICAgICAgIHsvKnRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7Ki99XG4gICAgICAgICAvLyAgICB7Lyp9Ki99XG5cbiAgICAgICAgIC8vICAgIGhhbmRsZUNsaWNrKCkge1xuICAgICAgICAgLy8gICAgICAgLy9jb21tYW5kcy5zZWxlY3QoIGV2ZW50IClcIlxuICAgICAgICAgLy8gICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgIC8vICAgICAgICAgIGlzVG9nZ2xlT246ICFwcmV2U3RhdGUuaXNUb2dnbGVPblxuICAgICAgICAgLy8gICAgICAgfSkpO1xuICAgICAgICAgLy8gICAgfVxuICAgICAgICAgLy9cbiAgICAgICAgIC8vICAgIHJlbmRlcigpIHtcbiAgICAgICAgIC8vICAgICAgIHJldHVybiAoXG4gICAgICAgICAvLyAgICAgICAgICA8dGJvZHkgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF0dGVybi0gKyB7ZXZlbnQucGF0dGVybn0gK1xuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgYXgtZXZlbnQtaW50ZXJhY3Rpb24tICsge2V2ZW50LmludGVyYWN0aW9ufSArXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICB7ZXZlbnQuc2VsZWN0ZWQgPyAnIGF4LWV2ZW50LXNlbGVjdGVkJyA6ICcnICkgK1xuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAoIGV2ZW50LnByb2JsZW1zLmxlbmd0aCA/ICcgYXgtZXZlbnQtaGFzLXByb2JsZW1zJyA6ICcnIClcIlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgLy8gICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXN1bW1hcnlcIj5cbiAgICAgICAgIC8vICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF0dGVybi1pY29uXCJcbiAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aXRsZT1cInt7IGV2ZW50LnBhdHRlcm4gfX1cIlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgIG5nLWJpbmQtaHRtbD1cInZpZXcucGF0dGVybnNCeU5hbWVbIGV2ZW50LnBhdHRlcm4gXS5odG1sSWNvblwiPjwvdGQ+XG4gICAgICAgICAvLyAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWludGVyYWN0aW9uXCI+e3tldmVudC5pbnRlcmFjdGlvbn19PC90ZD5cbiAgICAgICAgIC8vICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCI+XG4gICAgICAgICAvLyAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIG5nLWlmPVwiZXZlbnQuaW50ZXJhY3Rpb24gPT0gJ3B1Ymxpc2gnICYmICFldmVudC5zaG93RGV0YWlsc1wiXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsaWNrPVwiZXZlbnQuc2hvd0RldGFpbHMgPSB0cnVlOyAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XCI+PGkgY2xhc3NOYW1lPVwiZmEgZmEtcGx1cy1zcXVhcmVcIj4mbmJzcDs8L2k+PC9idXR0b24+XG4gICAgICAgICAvLyAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIG5nLWlmPVwiZXZlbnQuaW50ZXJhY3Rpb24gPT0gJ3B1Ymxpc2gnICYmIGV2ZW50LnNob3dEZXRhaWxzXCJcbiAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xpY2s9XCJldmVudC5zaG93RGV0YWlscyA9IGZhbHNlOyAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XCI+PGkgY2xhc3NOYW1lPVwiZmEgZmEtbWludXMtc3F1YXJlXCIgPiZuYnNwOzwvaT48L2J1dHRvbj5cbiAgICAgICAgIC8vICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAvLyAgICAgICAgICAgICA8dGQgbmctYmluZC1odG1sPVwiZXZlbnQuaHRtbE5hbWVcIj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIG5nLWJpbmQtaHRtbD1cImV2ZW50Lmh0bWxTb3VyY2VcIj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIG5nLWJpbmQtaHRtbD1cImV2ZW50Lmh0bWxUYXJnZXRcIj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1jeWNsZSB0ZXh0LXJpZ2h0XCI+e3tldmVudC5jeWNsZUlkfX08L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj48c3Bhbj57e2V2ZW50LmZvcm1hdHRlZFRpbWUudXBwZXJ9fTwvc3Bhbj48YnIgLz48c3Bhbj57e2V2ZW50LmZvcm1hdHRlZFRpbWUubG93ZXJ9fTwvc3Bhbj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgPC90cj5cbiAgICAgICAgIC8vICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1wYXlsb2FkXCJcbiAgICAgICAgIC8vICAgICAgICAgICAgICBuZy1pZj1cImV2ZW50LnByb2JsZW1zLmxlbmd0aFwiPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+PC90ZD5cbiAgICAgICAgIC8vICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiNVwiPlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdD1cInByb2JsZW0gaW4gZXZlbnQucHJvYmxlbXMgdHJhY2sgYnkgcHJvYmxlbS5kZXNjcmlwdGlvblwiXG4gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbVwiPlxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtd2FybmluZ1wiPjwvaT4ge3sgcHJvYmxlbS5kZXNjcmlwdGlvbiB9fVxuICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgIC8vICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAvLyAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgPC90cj5cbiAgICAgICAgIC8vICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1wYXlsb2FkXCJcbiAgICAgICAgIC8vICAgICAgICAgICAgICBuZy1pZj1cImV2ZW50LnNob3dEZXRhaWxzXCI+XG4gICAgICAgICAvLyAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj48L3RkPlxuICAgICAgICAgLy8gICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI1XCIgPjxwcmU+e3tldmVudC5mb3JtYXR0ZWRFdmVudH19PC9wcmU+PC90ZD5cbiAgICAgICAgIC8vICAgICAgICAgIDwvdHI+XG4gICAgICAgICAvLyAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgLy8gICAgICAgKTtcbiAgICAgICAgIC8vICAgIH1cbiAgICAgICAgIC8vIH1cblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgY2xhc3MgU2hvd0RldGFpbHNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAgICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk5hbWVDaGFuZ2VkKCF0aGlzLnByb3BzLnNob3dEZXRhaWxzKTtcbiAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgICAgIHJldHVybiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tbGluayBidG4taW5mb1wiXG4gICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17IHRoaXMucHJvcHMuc2hvd0RldGFpbHMgPyBcImZhIGZhLW1pbnVzLXNxdWFyZVwiIDogXCJmYSBmYS1wbHVzLXNxdWFyZVwiIH0gPiZuYnNwOzwvaT5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgY2xhc3MgRXZlbnRCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgc2hvd0RldGFpbHM6IHByb3BzLmV2ZW50LnNob3dEZXRhaWxzLFxuICAgICAgICAgICAgICAgICAgY3NzQ2xhc3NOYW1lOiAnJ1xuICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlTmFtZSA9IHRoaXMuaGFuZGxlTmFtZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jc3NDbGFzc05hbWUgPSAnYXgtZXZlbnQtcGF0dGVybi0nICsgdGhpcy5wcm9wcy5ldmVudC5wYXR0ZXJuICtcbiAgICAgICAgICAgICAgICcgYXgtZXZlbnQtaW50ZXJhY3Rpb24tJyArIHRoaXMucHJvcHMuZXZlbnQuaW50ZXJhY3Rpb24gK1xuICAgICAgICAgICAgICAgKCB0aGlzLnByb3BzLmV2ZW50LnNlbGVjdGVkID8gJyBheC1ldmVudC1zZWxlY3RlZCcgOiAnJyApICtcbiAgICAgICAgICAgICAgICggdGhpcy5wcm9wcy5ldmVudC5wcm9ibGVtcy5sZW5ndGggPyAnIGF4LWV2ZW50LWhhcy1wcm9ibGVtcycgOiAnJyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoYW5kbGVOYW1lKCl7XG4gICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKCB7IHNob3dEZXRhaWxzOiAhdGhpcy5zdGF0ZS5zaG93RGV0YWlscyB9ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhhbmRsZUNsaWNrKCBlICkge1xuICAgICAgICAgICAgICAgLy8gc2VsZWN0OiBmdW5jdGlvbiggZXZlbnRJbmZvICkge1xuICAgICAgICAgICAgICAgLy8gICAgbW9kZWwuc2VsZWN0aW9uRXZlbnRJbmZvID0gZXZlbnRJbmZvLnNlbGVjdGVkID8gbnVsbCA6IGV2ZW50SW5mbztcbiAgICAgICAgICAgICAgIC8vICAgIHJ1bkZpbHRlcnMoKTtcbiAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50U3VtbWFyeVJvdyA9IChcbiAgICAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJheC1ldmVudC1zdW1tYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLXBhdHRlcm4taWNvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMuZXZlbnQucGF0dGVybn0+IDxQYXR0ZXJuc0h0bWxJY29uIG5hbWU9e3RoaXMucHJvcHMuZXZlbnQucGF0dGVybn0gLz48L3RkPlxuICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImF4LWNvbC1pbnRlcmFjdGlvblwiPnt0aGlzLnByb3BzLmV2ZW50LmludGVyYWN0aW9ufTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLXBheWxvYWQtaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLmV2ZW50LmludGVyYWN0aW9uID09ICdwdWJsaXNoJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8U2hvd0RldGFpbHNCdXR0b24gc2hvd0RldGFpbHM9e3RoaXMuc3RhdGUuc2hvd0RldGFpbHN9IG9uTmFtZUNoYW5nZWQ9e3RoaXMuaGFuZGxlTmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgIDx0ZD57dGhpcy5wcm9wcy5ldmVudC5odG1sTmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgPHRkPnt0aGlzLnByb3BzLmV2ZW50Lmh0bWxTb3VyY2V9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgIDx0ZD57dGhpcy5wcm9wcy5ldmVudC5odG1sVGFyZ2V0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiYXgtY29sLWN5Y2xlIHRleHQtcmlnaHRcIj57dGhpcy5wcm9wcy5ldmVudC5jeWNsZUlkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPjxzcGFuPnt0aGlzLnByb3BzLmV2ZW50LmZvcm1hdHRlZFRpbWUudXBwZXJ9PC9zcGFuPjxiciAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkVGltZS5sb3dlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRldGFpbHNSb3coIHNob3csIGZvcm1hdHRlZEV2ZW50ICkge1xuICAgICAgICAgICAgICAgICAgaWYoIXNob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8dHIgLz47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gICg8dHIgY2xhc3NOYW1lPVwiYXgtZXZlbnQtcGF5bG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49XCIzXCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHByZT57Zm9ybWF0dGVkRXZlbnR9PC9wcmU+XG4gICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPC90cj4pO1xuICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAgICAvL1RPRE86IFRlc3QgZGlzcGxheSBvZiBwcm9ibGVtc1xuXG4gICAgICAgICAgICAgICBmdW5jdGlvbiBldmVudFByb2JsZW1zKCBwcm9ibGVtcyApIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RPZlByb2JsZW1zID0gcHJvYmxlbXMubWFwKCAoIHByb2JsZW0gKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17cHJvYmxlbS5kZXNjcmlwdGlvbn0gY2xhc3NOYW1lPVwiYXgtZXZlbnQtcHJvYmxlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtd2FybmluZ1wiPjwvaT4gcHJvYmxlbS5kZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImF4LWV2ZW50LXBheWxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPVwiM1wiPjwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsaXN0T2ZQcm9ibGVtc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8dGJvZHlcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17IHRoaXMuc3RhdGUuY3NzQ2xhc3NOYW1lIH1cbiAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICB7IGV2ZW50U3VtbWFyeVJvdyB9XG4gICAgICAgICAgICAgICAgICAgICB7IHRoaXMucHJvcHMuZXZlbnQucHJvYmxlbXMubGVuZ3RoICYmIGV2ZW50UHJvYmxlbXMoIHRoaXMucHJvcHMuZXZlbnQucHJvYmxlbXMgKSB9XG4gICAgICAgICAgICAgICAgICAgICB7IGRldGFpbHNSb3coIHRoaXMuc3RhdGUuc2hvd0RldGFpbHMsIHRoaXMucHJvcHMuZXZlbnQuZm9ybWF0dGVkRXZlbnQgKSB9XG4gICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgY29uc3QgZXZlbnRzID0gbW9kZWwudmlzaWJsZUV2ZW50SW5mb3MubWFwKCAoIGV2ZW50LCBrZXkgKT0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIC8vPEV2ZW50Qm9keSB7Li4uZXZlbnR9IGtleT17a2V5fSB2aWV3UGF0dGVybnNCeU5hbWU9e3ZpZXcucGF0dGVybnNCeU5hbWV9Lz5cbiAgICAgICAgICAgICAgIDxFdmVudEJvZHkgZXZlbnQ9e2V2ZW50fSBrZXk9e2tleX0gdmlld1BhdHRlcm5zQnlOYW1lPXt2aWV3LnBhdHRlcm5zQnlOYW1lfS8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgfSApO1xuXG4gICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlXCI+XG4gICAgICAgICAgICAgICA8Y29sZ3JvdXA+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1wYXR0ZXJuLWljb25cIiAvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtaW50ZXJhY3Rpb25cIiAvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtcGF5bG9hZC1pY29uXCIgLz5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLW5hbWVcIiAvPlxuICAgICAgICAgICAgICAgICAgPGNvbCBjbGFzc05hbWU9XCJheC1jb2wtc291cmNlXCIgLz5cbiAgICAgICAgICAgICAgICAgIDxjb2wgY2xhc3NOYW1lPVwiYXgtY29sLXRhcmdldFwiIC8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC1jeWNsZVwiIC8+XG4gICAgICAgICAgICAgICAgICA8Y29sIGNsYXNzTmFtZT1cImF4LWNvbC10aW1lc3RhbXBcIiAvPlxuICAgICAgICAgICAgICAgPC9jb2xncm91cD5cbiAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD4mbmJzcDs8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGg+Jm5ic3A7PC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD5FdmVudCBOYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aD5Tb3VyY2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgPHRoPlRhcmdldDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPkN5Y2xlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+VGltZTxpIGNsYXNzTmFtZT1cImZhIGZhLWxvbmctYXJyb3ctdXBcIiAvPjwvdGg+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgIHtldmVudHN9XG4gICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4gICAgICByZWFjdFJlbmRlcihcbiAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8cD5oZWxsbzwvcD5cbiAgICAgICAgICAgIHthZmZpeCgpfVxuICAgICAgICAgICAge2V2ZW50TGlzdFRhYmxlKCl9XG4gICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgcmV0dXJuIHtcbiAgICAgIG9uRG9tQXZhaWxhYmxlOiByZW5kZXJcbiAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICdldmVudHMtZGlzcGxheS13aWRnZXQnLFxuICAgaW5qZWN0aW9uczogWyAnYXhDb250ZXh0JywgJ2F4UmVhY3RSZW5kZXInLCAnYXhGbG93U2VydmljZScgXSxcbiAgIGNyZWF0ZVxufTtcbiJdfQ==
